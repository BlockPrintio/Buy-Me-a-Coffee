//// Support Ada — on-chain support receipts.
////
//// A tip on Cardano is just a payment, so the interesting question is not
//// "how do we move the ADA" but "how does anyone later prove the creator was
//// actually paid, and that the platform took only the fee it advertises".
////
//// This policy answers that. It mints a single receipt token, and it will
//// only do so inside a transaction that genuinely pays the creator the full
//// support amount and pays the platform no more than its advertised cut.
//// The receipt is therefore self-evidencing: holding one is proof the split
//// was honoured, because the ledger would have rejected the mint otherwise.
////
//// The funds themselves never touch a script address — they go straight from
//// supporter to creator in the same transaction, which is what keeps the flow
//// non-custodial and instant.

use aiken/collection/dict
use aiken/collection/list
use cardano/address.{Credential}
use cardano/assets.{Lovelace, PolicyId}
use cardano/transaction.{Output, Transaction}

/// Basis points denominator. 10_000 bps = 100%.
pub const bps_denominator: Int = 10_000

/// A hard ceiling on what the platform may ever charge, baked into the
/// validator itself. Even a misconfigured deployment cannot mint a receipt
/// for a transaction that skims more than 10% off a supporter.
pub const max_fee_bps: Int = 1_000

pub type Action {
  /// Mint one receipt for a support payment of `amount` lovelace to `creator`.
  Support { creator: Credential, amount: Lovelace }
  /// Receipts are the supporter's own; they may always destroy them.
  Burn
}

/// Total lovelace paid to a given payment credential across all outputs.
///
/// Summing rather than looking for a single matching output means a wallet is
/// free to split its change however it likes without breaking the check.
///
/// One consequence, since the platform's fee is pinned to an exact total:
/// change returning to the platform's own credential would count towards that
/// total, so the platform cannot fund support from the wallet it collects fees
/// into. Support from a separate wallet, which is the sane arrangement anyway.
pub fn paid_to(outputs: List<Output>, beneficiary: Credential) -> Lovelace {
  list.foldl(
    outputs,
    0,
    fn(output: Output, total: Lovelace) {
      if output.address.payment_credential == beneficiary {
        total + assets.lovelace_of(output.value)
      } else {
        total
      }
    },
  )
}

/// The platform's cut of a support amount, rounded down so that rounding
/// error always favours the creator rather than the platform.
pub fn platform_fee(amount: Lovelace, fee_bps: Int) -> Lovelace {
  amount * fee_bps / bps_denominator
}

/// What the platform may actually claim on-chain — the whole fee rule, in one
/// function. Small support is free; once the cut is worth collecting, it is
/// collected in full.
///
/// Cardano refuses to create an output holding less than the min-UTxO deposit
/// (~0.86 ADA), so a percentage cut of a small tip is not merely uneconomic —
/// it is impossible to pay. At 2.5% the cut only reaches that deposit at ~34
/// ADA of support, so anything smaller could never have been charged anyway.
///
/// Rather than inflate small tips up to the deposit, the fee is waived outright
/// below `min_fee`: coffee-sized support costs the supporter nothing extra and
/// the creator receives every lovelace of it. `min_fee` is a deployment choice
/// and may sit above that ledger floor — at the shipped 1 ADA, support under 40
/// ADA is free.
///
/// Both bounds are enforced at the call site: the platform is paid exactly this
/// figure, so "free" genuinely means free.
pub fn fee_due(amount: Lovelace, fee_bps: Int, min_fee: Lovelace) -> Lovelace {
  let fee = platform_fee(amount, fee_bps)
  if fee >= min_fee {
    fee
  } else {
    0
  }
}

/// True when this transaction mints exactly one token of `policy_id`, in
/// quantity one. Anything else — two receipts, a quantity of five, a receipt
/// bundled with an unrelated token of the same policy — is rejected.
pub fn mints_single_receipt(self: Transaction, policy_id: PolicyId) -> Bool {
  let minted_under_policy = assets.tokens(self.mint, policy_id)
  when dict.values(minted_under_policy) is {
    [quantity] -> quantity == 1
    _ -> False
  }
}

/// True when every token of `policy_id` in this transaction is being removed
/// from circulation.
pub fn burns_only(self: Transaction, policy_id: PolicyId) -> Bool {
  let quantities = dict.values(assets.tokens(self.mint, policy_id))
  and {
    quantities != [],
    list.all(quantities, fn(quantity) { quantity < 0 }),
  }
}

/// `platform` is the payment credential collecting the fee, `fee_bps` the
/// advertised rate, and `min_fee` the smallest fee worth paying as its own
/// output. All three are applied at build time, so a deployed policy id
/// commits to one specific platform on one specific set of terms — changing
/// any of them yields a different policy id, and receipts already minted stay
/// verifiable under the terms they were minted with.
validator receipt(platform: Credential, fee_bps: Int, min_fee: Lovelace) {
  mint(redeemer: Action, policy_id: PolicyId, self: Transaction) {
    when redeemer is {
      Support { creator, amount } -> and {
        // A receipt for nothing would be meaningless.
        amount > 0,
        // Refuse to operate under predatory terms, whatever the parameters say.
        fee_bps >= 0,
        fee_bps <= max_fee_bps,
        // Paying yourself is not support; it would let anyone forge receipts
        // by cycling funds through their own wallet.
        creator != platform,
        // The creator receives the full advertised amount. More is always
        // welcome — generosity is not an attack.
        paid_to(self.outputs, creator) >= amount,
        // The platform receives exactly its cut: no less, and no more.
        //
        // The upper bound is what makes the waiver real. With only a lower
        // bound, `fee_due` returning zero for a coffee-sized tip permits any
        // fee at all — a supporter told the tip was free could be charged half
        // of it and still walk away holding a valid receipt. Pinning the figure
        // is what lets the receipt attest to the split rather than merely to a
        // floor on it.
        paid_to(self.outputs, platform) == fee_due(amount, fee_bps, min_fee),
        // Exactly one receipt leaves this transaction.
        mints_single_receipt(self, policy_id),
      }
      Burn -> burns_only(self, policy_id)
    }
  }

  else(_) {
    fail @"support: this policy only handles minting and burning"
  }
}
