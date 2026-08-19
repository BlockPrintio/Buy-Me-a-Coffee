//// Tests for the support receipt policy.
////
//// The happy path matters least here. What matters is that a receipt cannot
//// be minted by anyone who skips the creator, shortchanges them, skims extra
//// for the platform, or forges support to themselves — and that the fee
//// waiver for small tips cannot be turned into a way to dodge a fee that is
//// genuinely due.

use cardano/address.{Address, Credential, Script, VerificationKey}
use cardano/assets
use cardano/transaction.{NoDatum, Output, Transaction}
use support.{Action, Ada, Burn, Support, Token, Unit, fee_due, fee_floor, platform_fee}

// ---------------------------------------------------------------- fixtures

const creator_vkh: ByteArray =
  #"00000000000000000000000000000000000000000000000000000001"

const platform_vkh: ByteArray =
  #"00000000000000000000000000000000000000000000000000000002"

const stranger_vkh: ByteArray =
  #"00000000000000000000000000000000000000000000000000000003"

const policy: ByteArray =
  #"11111111111111111111111111111111111111111111111111111111"

const receipt_name: ByteArray = #"52454345495054"

/// 2.5%, the rate the product advertises.
const fee_bps: Int = 250

/// Roughly the min-UTxO deposit — below this a fee output cannot exist.
const min_fee: Int = 1_000_000

/// A token fee output strands more ada than an ada one, so its floor is set
/// separately. 1 USDC at six decimals.
const min_fee_token: Int = 1_000_000

/// The named stablecoin issuer this deployment settles in.
const usdc_policy: ByteArray =
  #"22222222222222222222222222222222222222222222222222222222"

const usdc_name: ByteArray = #"55534443"

/// A token nobody agreed to accept, minted by an attacker for free.
const fake_policy: ByteArray =
  #"66666666666666666666666666666666666666666666666666666666"

fn accepted() -> List<ByteArray> {
  [usdc_policy]
}

fn usdc() -> Unit {
  Token { policy: usdc_policy, name: usdc_name }
}

/// A support large enough that the 2.5% cut clears min-UTxO: 100 ADA, fee 2.5.
const large: Int = 100_000_000

const large_fee: Int = 2_500_000

/// A coffee-sized support: 10 ADA, whose 0.25 ADA cut is unpayable and waived.
const small: Int = 10_000_000

fn creator() -> Credential {
  VerificationKey(creator_vkh)
}

fn platform() -> Credential {
  VerificationKey(platform_vkh)
}

fn stranger() -> Credential {
  VerificationKey(stranger_vkh)
}

fn pay(beneficiary: Credential, lovelace: Int) -> Output {
  Output {
    address: Address { payment_credential: beneficiary, stake_credential: None },
    value: assets.from_lovelace(lovelace),
    datum: NoDatum,
    reference_script: None,
  }
}

/// An output carrying `quantity` of a token, plus the ada deposit the ledger
/// would require to deliver it.
fn pay_token(
  beneficiary: Credential,
  token_policy: ByteArray,
  token_name: ByteArray,
  quantity: Int,
) -> Output {
  Output {
    address: Address { payment_credential: beneficiary, stake_credential: None },
    value: assets.from_lovelace(1_400_000)
      |> assets.add(token_policy, token_name, quantity),
    datum: NoDatum,
    reference_script: None,
  }
}

/// A transaction paying out `outputs` and minting `quantity` receipts.
fn tx(outputs: List<Output>, quantity: Int) -> Transaction {
  Transaction {
    ..transaction.placeholder,
    outputs: outputs,
    mint: assets.from_asset(policy, receipt_name, quantity),
  }
}

fn mint_with(redeemer: Action, self: Transaction) -> Bool {
  support.receipt.mint(
    platform(),
    fee_bps,
    min_fee,
    min_fee_token,
    accepted(),
    redeemer,
    policy,
    self,
  )
}

fn support_for(lovelace: Int) -> Action {
  Support { creator: creator(), amount: lovelace, unit: Ada }
}

fn support_usdc(quantity: Int) -> Action {
  Support { creator: creator(), amount: quantity, unit: usdc() }
}

// ------------------------------------------------------------------- fees

test fee_is_two_and_a_half_percent() {
  platform_fee(large, fee_bps) == large_fee
}

test fee_rounds_down_in_the_creators_favour() {
  // 1 lovelace at 2.5% is 0.025 — the platform gets nothing rather than 1.
  platform_fee(1, fee_bps) == 0
}

test fee_is_due_once_it_clears_the_deposit() {
  fee_due(large, fee_bps, min_fee) == large_fee
}

test fee_is_waived_below_the_deposit() {
  // 0.25 ADA cannot exist as its own output, so nothing is owed.
  fee_due(small, fee_bps, min_fee) == 0
}

test fee_is_due_exactly_at_the_threshold() {
  // 40 ADA is the first support whose 2.5% cut reaches 1 ADA.
  fee_due(40_000_000, fee_bps, min_fee) == min_fee
}

test fee_is_waived_just_below_the_threshold() {
  fee_due(39_999_960, fee_bps, min_fee) == 0
}

// ------------------------------------------------------------ happy path

test mints_when_the_split_is_honoured() {
  mint_with(
    support_for(large),
    tx([pay(creator(), large), pay(platform(), large_fee)], 1),
  )
}

test mints_a_small_tip_with_no_platform_output() {
  // The waiver means a coffee needs no fee output at all.
  mint_with(support_for(small), tx([pay(creator(), small)], 1))
}

test allows_paying_the_creator_more_than_asked() {
  mint_with(
    support_for(large),
    tx([pay(creator(), large * 2), pay(platform(), large_fee)], 1),
  )
}

test sums_the_platform_fee_across_split_outputs() {
  // The fee is pinned to a total, not to a single output, so a wallet may
  // still fragment it.
  mint_with(
    support_for(large),
    tx(
      [
        pay(creator(), large),
        pay(platform(), large_fee / 2),
        pay(platform(), large_fee / 2),
      ],
      1,
    ),
  )
}

test sums_creator_payment_across_split_outputs() {
  // A wallet may fragment its outputs however it likes.
  mint_with(
    support_for(large),
    tx(
      [
        pay(creator(), large / 2),
        pay(creator(), large / 2),
        pay(platform(), large_fee),
      ],
      1,
    ),
  )
}

test ignores_unrelated_outputs() {
  mint_with(
    support_for(large),
    tx(
      [
        pay(stranger(), 5_000_000),
        pay(creator(), large),
        pay(platform(), large_fee),
      ],
      1,
    ),
  )
}

// --------------------------------------------------------------- attacks

test rejects_when_the_creator_is_not_paid() fail {
  mint_with(support_for(large), tx([pay(platform(), large_fee)], 1))
}

test rejects_when_the_creator_is_shortchanged() fail {
  mint_with(
    support_for(large),
    tx([pay(creator(), large - 1), pay(platform(), large_fee)], 1),
  )
}

test rejects_when_a_due_fee_is_skipped() fail {
  mint_with(support_for(large), tx([pay(creator(), large)], 1))
}

test rejects_when_a_due_fee_is_underpaid() fail {
  mint_with(
    support_for(large),
    tx([pay(creator(), large), pay(platform(), large_fee - 1)], 1),
  )
}

test rejects_when_a_due_fee_is_overpaid() fail {
  // 2.5% is a rate, not a floor. Skimming more than advertised must not mint.
  mint_with(
    support_for(large),
    tx([pay(creator(), large), pay(platform(), large_fee + 1)], 1),
  )
}

test rejects_charging_a_fee_on_a_waived_tip() fail {
  // The heart of the waiver: a tip advertised as free cannot be charged
  // anything at all, however small.
  mint_with(
    support_for(small),
    tx([pay(creator(), small), pay(platform(), 1)], 1),
  )
}

test rejects_skimming_a_waived_tip_wholesale() fail {
  // The case the lower bound alone allowed: a "free" 10 ADA coffee quietly
  // charged 5 ADA, and still minting a receipt that claims the split was kept.
  mint_with(
    support_for(small),
    tx([pay(creator(), small), pay(platform(), small / 2)], 1),
  )
}

test understating_the_amount_only_ever_buys_a_smaller_receipt() {
  // Someone could declare a coffee-sized support to trigger the waiver while
  // paying the creator far more. That mints fine — but the receipt then
  // attests only to `small`, which is all the redeemer claimed. There is no
  // way to obtain a receipt for `large` without paying the fee on `large`.
  let understated = Support { creator: creator(), amount: small, unit: Ada }
  and {
    mint_with(understated, tx([pay(creator(), large)], 1)),
    fee_due(small, fee_bps, min_fee) == 0,
  }
}

test rejects_paying_the_creators_share_to_someone_else() fail {
  mint_with(
    support_for(large),
    tx([pay(stranger(), large), pay(platform(), large_fee)], 1),
  )
}

test rejects_self_support_by_the_platform() fail {
  // Otherwise the platform could mint receipts by paying itself.
  mint_with(
    Support { creator: platform(), amount: large, unit: Ada },
    tx([pay(platform(), large + large_fee)], 1),
  )
}

test rejects_zero_amount() fail {
  mint_with(support_for(0), tx([pay(creator(), 0)], 1))
}

test rejects_negative_amount() fail {
  mint_with(support_for(-1), tx([pay(creator(), large)], 1))
}

test rejects_a_predatory_fee_rate() fail {
  // 20% — above the ceiling compiled into the validator.
  let greedy = 2_000
  support.receipt.mint(
    platform(),
    greedy,
    min_fee,
    min_fee_token,
    accepted(),
    support_for(large),
    policy,
    tx([pay(creator(), large), pay(platform(), large * greedy / 10_000)], 1),
  )
}

// ------------------------------------------------------------ mint shape

test rejects_minting_two_receipts_at_once() fail {
  mint_with(
    support_for(large),
    tx([pay(creator(), large), pay(platform(), large_fee)], 2),
  )
}

test rejects_a_transaction_that_mints_nothing() fail {
  mint_with(
    support_for(large),
    Transaction {
      ..transaction.placeholder,
      outputs: [pay(creator(), large), pay(platform(), large_fee)],
    },
  )
}

// ------------------------------------------------------------------ burn

test allows_burning_a_receipt() {
  mint_with(Burn, tx([], -1))
}

test rejects_a_mint_disguised_as_a_burn() fail {
  mint_with(Burn, tx([], 1))
}

// -------------------------------------------------- script-based creators

test supports_a_creator_behind_a_script_address() {
  // Creators using a smart-contract wallet are first-class here.
  let script_creator = Script(creator_vkh)
  mint_with(
    Support { creator: script_creator, amount: large, unit: Ada },
    tx([pay(script_creator, large), pay(platform(), large_fee)], 1),
  )
}

// ------------------------------------------------- stablecoin settlement

/// 100 USDC at six decimals. The 2.5% cut is 2.5 USDC, clear of the token floor.
const large_usdc: Int = 100_000_000

const large_usdc_fee: Int = 2_500_000

/// 10 USDC. The cut is 0.25 USDC, under the floor, so it is waived.
const small_usdc: Int = 10_000_000

test settles_in_an_accepted_stablecoin() {
  mint_with(
    support_usdc(large_usdc),
    tx(
      [
        pay_token(creator(), usdc_policy, usdc_name, large_usdc),
        pay_token(platform(), usdc_policy, usdc_name, large_usdc_fee),
      ],
      1,
    ),
  )
}

test waives_a_small_stablecoin_fee() {
  // Same rule as ada: below the floor the creator keeps all of it and the
  // transaction needs no fee output at all.
  mint_with(
    support_usdc(small_usdc),
    tx([pay_token(creator(), usdc_policy, usdc_name, small_usdc)], 1),
  )
}

test rejects_a_token_from_an_unnamed_issuer() fail {
  // The forgery this policy exists to stop: mint a worthless token for free,
  // "support" a creator with a hundred of them, and claim a valid receipt.
  let counterfeit = Token { policy: fake_policy, name: usdc_name }
  mint_with(
    Support { creator: creator(), amount: large_usdc, unit: counterfeit },
    tx([pay_token(creator(), fake_policy, usdc_name, large_usdc)], 1),
  )
}

test rejects_the_right_issuer_with_the_wrong_asset_name() fail {
  // One issuer can mint many assets; only the named one is the stablecoin.
  let wrong_name = Token { policy: usdc_policy, name: #"4e4f5045" }
  mint_with(
    Support { creator: creator(), amount: large_usdc, unit: wrong_name },
    tx([pay_token(creator(), usdc_policy, usdc_name, large_usdc)], 1),
  )
}

test rejects_paying_ada_when_the_support_was_declared_in_stablecoin() fail {
  // Declaring 100 USDC and settling 100 ada is a hundredfold discount at the
  // exchange rates these assets actually trade at.
  mint_with(
    support_usdc(large_usdc),
    tx(
      [pay(creator(), large_usdc), pay_token(platform(), usdc_policy, usdc_name, large_usdc_fee)],
      1,
    ),
  )
}

test rejects_a_stablecoin_fee_settled_in_ada() fail {
  // The fee is owed in the unit the support was denominated in.
  mint_with(
    support_usdc(large_usdc),
    tx(
      [pay_token(creator(), usdc_policy, usdc_name, large_usdc), pay(platform(), large_usdc_fee)],
      1,
    ),
  )
}

test rejects_underpaying_the_stablecoin_fee() fail {
  mint_with(
    support_usdc(large_usdc),
    tx(
      [
        pay_token(creator(), usdc_policy, usdc_name, large_usdc),
        pay_token(platform(), usdc_policy, usdc_name, large_usdc_fee - 1),
      ],
      1,
    ),
  )
}

test rejects_overcharging_a_waived_stablecoin_tip() fail {
  // A tip advertised as free cannot be charged anything, in any unit.
  mint_with(
    support_usdc(small_usdc),
    tx(
      [
        pay_token(creator(), usdc_policy, usdc_name, small_usdc),
        pay_token(platform(), usdc_policy, usdc_name, 1),
      ],
      1,
    ),
  )
}

test the_two_fee_floors_are_independent() {
  // The ada floor cannot silently govern a token fee. Both are stated
  // separately at build time precisely because a token output strands more ada.
  and {
    fee_floor(Ada, min_fee, min_fee_token) == min_fee,
    fee_floor(usdc(), min_fee, min_fee_token) == min_fee_token,
    fee_due(large_usdc, fee_bps, fee_floor(usdc(), min_fee, min_fee_token)) == large_usdc_fee,
    fee_due(small_usdc, fee_bps, fee_floor(usdc(), min_fee, min_fee_token)) == 0,
  }
}
