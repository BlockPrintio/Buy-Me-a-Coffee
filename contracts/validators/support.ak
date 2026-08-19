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
use cardano/assets.{AssetName, Lovelace, PolicyId}
use cardano/transaction.{Output, Transaction}

/// Basis points denominator. 10_000 bps = 100%.
pub const bps_denominator: Int = 10_000

/// A hard ceiling on what the platform may ever charge, baked into the
/// validator itself. Even a misconfigured deployment cannot mint a receipt
/// for a transaction that skims more than 10% off a supporter.
pub const max_fee_bps: Int = 1_000

/// What a support was denominated in.
///
/// A creator paid for work already done carries the currency risk on money
/// they have earned, which is the single most common reason a creator will not
/// take income in ada. Letting the same policy settle either way is what makes
/// that choice theirs rather than ours.
pub type Unit {
  Ada
  Token { policy: PolicyId, name: AssetName }
}

pub type Action {
  /// Mint one receipt for a support payment of `amount` of `unit` to `creator`.
  Support { creator: Credential, amount: Int, unit: Unit }
  /// Receipts are the supporter's own; they may always destroy them.
  Burn
}

/// Whether this policy will settle in a given unit.
///
/// Ada always. A token only if its policy is on the list applied at build time.
///
/// Without the list, a receipt would attest to nothing: anyone could mint a
/// worthless token, "support" a creator with a million of it, satisfy every
/// check in here and walk away holding a valid receipt. Restricting settlement
/// to named issuers is what keeps a receipt evidence of value received rather
/// than evidence of arithmetic.
pub fn is_accepted(unit: Unit, accepted: List<PolicyId>) -> Bool {
  when unit is {
    Ada -> True
    Token { policy, .. } -> list.has(accepted, policy)
  }
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
pub fn paid_to(
  outputs: List<Output>,
  beneficiary: Credential,
  unit: Unit,
) -> Int {
  list.foldl(
    outputs,
    0,
    fn(output: Output, total: Int) {
      if output.address.payment_credential == beneficiary {
        total + quantity_in(output, unit)
      } else {
        total
      }
    },
  )
}

/// How much of `unit` a single output carries.
fn quantity_in(output: Output, unit: Unit) -> Int {
  when unit is {
    Ada -> assets.lovelace_of(output.value)
    Token { policy, name } -> assets.quantity_of(output.value, policy, name)
  }
}

/// The platform's cut of a support amount, rounded down so that rounding
/// error always favours the creator rather than the platform.
pub fn platform_fee(amount: Int, fee_bps: Int) -> Int {
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
pub fn fee_due(amount: Int, fee_bps: Int, min_fee: Int) -> Int {
  let fee = platform_fee(amount, fee_bps)
  if fee >= min_fee {
    fee
  } else {
    0
  }
}

/// The smallest fee worth taking as its own output, in the unit being settled.
///
/// The two are not interchangeable, which is the whole reason this function
/// exists. A fee output in ada must clear the min-UTxO deposit of roughly 0.86
/// ada. A fee output carrying a token must clear a *larger* deposit, because
/// min-UTxO scales with the size of the output and a token adds a policy id, an
/// asset name and a quantity to it. Around 1.2 to 1.4 ada gets locked up to
/// deliver a stablecoin fee at all.
///
/// So a token fee has to be worth more than the ada it strands to be worth
/// collecting, and the validator cannot know an exchange rate to work that out.
/// The operator states the figure per unit at build time instead, and it is
/// part of the policy id like every other term.
pub fn fee_floor(unit: Unit, min_fee: Int, min_fee_token: Int) -> Int {
  when unit is {
    Ada -> min_fee
    Token { .. } -> min_fee_token
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

/// Every term is applied at build time, so a deployed policy id commits to one
/// platform on one set of terms: who collects the fee, the rate, the ada and
/// token floors below which it is waived, and which token issuers may be
/// settled in at all. Change any of them and you get a different policy id,
/// which leaves receipts already minted verifiable under the terms they were
/// minted with.
///
/// `accepted` in particular is a commitment worth reading twice: adding a
/// stablecoin later is not a config change, it is a new policy id and a new
/// deployment. That is deliberate. A policy whose accepted issuers could drift
/// would make every receipt it ever minted retrospectively ambiguous.
validator receipt(
  platform: Credential,
  fee_bps: Int,
  min_fee: Lovelace,
  min_fee_token: Int,
  accepted: List<PolicyId>,
) {
  mint(redeemer: Action, policy_id: PolicyId, self: Transaction) {
    when redeemer is {
      Support { creator, amount, unit } -> and {
        // A receipt for nothing would be meaningless.
        amount > 0,
        // Settle only in ada or a named issuer's token.
        is_accepted(unit, accepted),
        // Refuse to operate under predatory terms, whatever the parameters say.
        fee_bps >= 0,
        fee_bps <= max_fee_bps,
        // Paying yourself is not support; it would let anyone forge receipts
        // by cycling funds through their own wallet.
        creator != platform,
        // The creator receives the full advertised amount. More is always
        // welcome — generosity is not an attack.
        paid_to(self.outputs, creator, unit) >= amount,
        // The platform receives exactly its cut: no less, and no more.
        //
        // The upper bound is what makes the waiver real. With only a lower
        // bound, `fee_due` returning zero for a coffee-sized tip permits any
        // fee at all — a supporter told the tip was free could be charged half
        // of it and still walk away holding a valid receipt. Pinning the figure
        // is what lets the receipt attest to the split rather than merely to a
        // floor on it.
        paid_to(self.outputs, platform, unit) == fee_due(
          amount,
          fee_bps,
          fee_floor(unit, min_fee, min_fee_token),
        ),
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
