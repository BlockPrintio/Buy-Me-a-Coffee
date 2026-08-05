//// Tests for the membership subscription script.
////
//// The two sides can each cheat the other, so both directions are tested:
//// the creator taking too much, too early, or without leaving the remainder
//// behind; and the supporter walking away from a period already earned.

use aiken/interval
use cardano/address.{Address, Script, VerificationKey}
use cardano/assets
use cardano/transaction.{
  DatumHash, InlineDatum, Input, NoDatum, Output, OutputReference, Transaction,
  ValidityRange,
}
use membership.{Action, Cancel, Claim, Subscription, advanced}

// ---------------------------------------------------------------- fixtures

const supporter_vkh: ByteArray =
  #"00000000000000000000000000000000000000000000000000000011"

const creator_vkh: ByteArray =
  #"00000000000000000000000000000000000000000000000000000022"

const stranger_vkh: ByteArray =
  #"00000000000000000000000000000000000000000000000000000033"

const script_hash: ByteArray =
  #"00000000000000000000000000000000000000000000000000000099"

/// 15 ADA a month.
const per_period: Int = 15_000_000

const month: Int = 2_592_000_000

/// The first claim falls due at this instant.
const due_at: Int = 1_700_000_000_000

/// Three months funded up front.
const funded: Int = 45_000_000

fn terms() -> Subscription {
  Subscription {
    supporter: supporter_vkh,
    creator: creator_vkh,
    amount_per_period: per_period,
    period: month,
    next_claim_at: due_at,
  }
}

fn script_address() -> Address {
  Address { payment_credential: Script(script_hash), stake_credential: None }
}

fn own_ref() -> OutputReference {
  OutputReference { transaction_id: #"aa", output_index: 0 }
}

fn key_output(who: ByteArray, lovelace: Int) -> Output {
  Output {
    address: Address {
      payment_credential: VerificationKey(who),
      stake_credential: None,
    },
    value: assets.from_lovelace(lovelace),
    datum: NoDatum,
    reference_script: None,
  }
}

/// The output that keeps the remaining balance locked under new terms.
fn continuation(lovelace: Int, next: Subscription) -> Output {
  Output {
    address: script_address(),
    value: assets.from_lovelace(lovelace),
    datum: InlineDatum(next),
    reference_script: None,
  }
}

/// The subscription UTxO being spent.
fn locked_input(lovelace: Int) -> Input {
  Input {
    output_reference: own_ref(),
    output: Output {
      address: script_address(),
      value: assets.from_lovelace(lovelace),
      datum: InlineDatum(terms()),
      reference_script: None,
    },
  }
}

fn tx(
  locked: Int,
  outputs: List<Output>,
  signatories: List<ByteArray>,
  range: ValidityRange,
) -> Transaction {
  Transaction {
    ..transaction.placeholder,
    inputs: [locked_input(locked)],
    outputs: outputs,
    extra_signatories: signatories,
    validity_range: range,
  }
}

/// A transaction that cannot execute before `t`.
fn from_time(t: Int) -> ValidityRange {
  interval.after(t)
}

/// A transaction that cannot execute after `t`.
fn until_time(t: Int) -> ValidityRange {
  interval.before(t)
}

fn spend(redeemer: Action, self: Transaction) -> Bool {
  membership.membership.spend(Some(terms()), redeemer, own_ref(), self)
}

// ------------------------------------------------------------------ claim

test creator_claims_one_period_once_it_is_due() {
  let self =
    tx(
      funded,
      [
        key_output(creator_vkh, per_period),
        continuation(funded - per_period, advanced(terms())),
      ],
      [creator_vkh],
      from_time(due_at),
    )
  spend(Claim, self)
}

test creator_claims_the_final_period_with_no_continuation() {
  // The last period empties the subscription, so nothing needs to stay locked.
  let self =
    tx(per_period, [key_output(creator_vkh, per_period)], [creator_vkh], from_time(due_at))
  spend(Claim, self)
}

test rejects_a_claim_before_the_period_is_up() fail {
  let self =
    tx(
      funded,
      [
        key_output(creator_vkh, per_period),
        continuation(funded - per_period, advanced(terms())),
      ],
      [creator_vkh],
      from_time(due_at - 1),
    )
  spend(Claim, self)
}

test rejects_a_claim_with_no_lower_bound() fail {
  // Without a lower bound nothing proves the claim date has passed, so an
  // open-ended transaction must not be taken on trust.
  let self =
    tx(
      funded,
      [
        key_output(creator_vkh, per_period),
        continuation(funded - per_period, advanced(terms())),
      ],
      [creator_vkh],
      interval.everything,
    )
  spend(Claim, self)
}

test rejects_a_claim_the_creator_did_not_sign() fail {
  let self =
    tx(
      funded,
      [
        key_output(creator_vkh, per_period),
        continuation(funded - per_period, advanced(terms())),
      ],
      [stranger_vkh],
      from_time(due_at),
    )
  spend(Claim, self)
}

test rejects_taking_two_periods_at_once() fail {
  // Draining 30 ADA while only leaving 15 behind.
  let self =
    tx(
      funded,
      [
        key_output(creator_vkh, per_period * 2),
        continuation(funded - per_period * 2, advanced(terms())),
      ],
      [creator_vkh],
      from_time(due_at),
    )
  spend(Claim, self)
}

test rejects_keeping_the_remainder_out_of_the_script() fail {
  // The creator takes their period and pockets the rest instead of relocking.
  let self =
    tx(funded, [key_output(creator_vkh, funded)], [creator_vkh], from_time(due_at))
  spend(Claim, self)
}

test rejects_a_continuation_that_is_short() fail {
  let self =
    tx(
      funded,
      [
        key_output(creator_vkh, per_period),
        continuation(funded - per_period - 1, advanced(terms())),
      ],
      [creator_vkh],
      from_time(due_at),
    )
  spend(Claim, self)
}

test rejects_a_continuation_that_does_not_advance_the_date() fail {
  // Leaving the claim date untouched would let the creator claim again at once.
  let self =
    tx(
      funded,
      [
        key_output(creator_vkh, per_period),
        continuation(funded - per_period, terms()),
      ],
      [creator_vkh],
      from_time(due_at),
    )
  spend(Claim, self)
}

test rejects_a_continuation_that_rewrites_the_terms() fail {
  // Same date, but the creator quietly raises their own rate.
  let greedy =
    Subscription { ..advanced(terms()), amount_per_period: per_period * 2 }
  let self =
    tx(
      funded,
      [key_output(creator_vkh, per_period), continuation(funded - per_period, greedy)],
      [creator_vkh],
      from_time(due_at),
    )
  spend(Claim, self)
}

test rejects_a_continuation_whose_datum_is_only_hashed() fail {
  // A hash the chain cannot read is not terms anyone can rely on.
  let hashed_output =
    Output {
      address: script_address(),
      value: assets.from_lovelace(funded - per_period),
      datum: DatumHash(#"beef"),
      reference_script: None,
    }
  let self =
    tx(funded, [key_output(creator_vkh, per_period), hashed_output], [creator_vkh], from_time(due_at))
  spend(Claim, self)
}

test rejects_splitting_the_remainder_across_two_script_outputs() fail {
  // Two continuations would let a second subscription be satisfied by the same
  // output in a combined transaction.
  let half = ( funded - per_period ) / 2
  let self =
    tx(
      funded,
      [
        key_output(creator_vkh, per_period),
        continuation(half, advanced(terms())),
        continuation(half, advanced(terms())),
      ],
      [creator_vkh],
      from_time(due_at),
    )
  spend(Claim, self)
}

// ----------------------------------------------------------------- cancel

test supporter_reclaims_the_balance_before_anything_is_due() {
  let self =
    tx(
      funded,
      [key_output(supporter_vkh, funded)],
      [supporter_vkh],
      until_time(due_at),
    )
  spend(Cancel, self)
}

test rejects_a_cancel_the_supporter_did_not_sign() fail {
  let self =
    tx(
      funded,
      [key_output(stranger_vkh, funded)],
      [stranger_vkh],
      until_time(due_at),
    )
  spend(Cancel, self)
}

test cancelling_after_a_period_is_due_pays_the_creator_first() {
  // No upper bound, so a period may have accrued: the creator is settled and
  // the supporter takes what is left.
  let self =
    tx(
      funded,
      [
        key_output(creator_vkh, per_period),
        key_output(supporter_vkh, funded - per_period),
      ],
      [supporter_vkh],
      interval.everything,
    )
  spend(Cancel, self)
}

test rejects_cancelling_out_from_under_an_earned_period() fail {
  // The supporter sweeps everything without bounding the transaction to before
  // the claim date, leaving the creator unpaid for a period they earned.
  let self =
    tx(
      funded,
      [key_output(supporter_vkh, funded)],
      [supporter_vkh],
      interval.everything,
    )
  spend(Cancel, self)
}

test rejects_backdating_a_cancel_past_the_claim_date() fail {
  // An upper bound after the claim date proves nothing, so the creator must
  // still be paid.
  let self =
    tx(
      funded,
      [key_output(supporter_vkh, funded)],
      [supporter_vkh],
      until_time(due_at + month),
    )
  spend(Cancel, self)
}
