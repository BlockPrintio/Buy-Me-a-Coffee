//// Support Ada — memberships.
////
//// There is no cron on a blockchain, so a "monthly membership" cannot mean a
//// charge that fires by itself. What it can mean, honestly, is a prepaid
//// balance the creator is allowed to draw down one period at a time.
////
//// A supporter locks some ADA here with the terms attached: how much per
//// period, how long a period lasts, and when the first claim becomes due. The
//// creator may then take exactly one period's worth once that date passes, and
//// the remainder returns to this same script with the date moved forward. The
//// supporter can stop at any point and take back what has not been earned.
////
//// Neither side can surprise the other. The creator cannot take two periods at
//// once, or take anything early. The supporter cannot cancel out from under a
//// period the creator has already earned — cancelling once a claim is due pays
//// the creator that period first.

use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use aiken/interval.{Finite}
use cardano/address.{Address, VerificationKey}
use cardano/assets.{Lovelace}
use cardano/transaction.{
  InlineDatum, Output, OutputReference, Transaction, find_input,
}

/// The terms of a membership, carried in the locked output's datum.
pub type Subscription {
  /// Funded the membership; may cancel and reclaim the unearned balance.
  supporter: VerificationKeyHash,
  /// Draws the membership down, one period at a time.
  creator: VerificationKeyHash,
  /// What the creator may take per period, in lovelace.
  amount_per_period: Lovelace,
  /// Length of a period, in milliseconds.
  period: Int,
  /// POSIX milliseconds. The creator may not claim before this instant.
  next_claim_at: Int,
}

pub type Action {
  /// The creator takes one period's payment.
  Claim
  /// The supporter stops the membership and reclaims the balance.
  Cancel
}

/// Total lovelace paid to a public-key address across all outputs.
pub fn paid_to_key(outputs: List<Output>, who: VerificationKeyHash) -> Lovelace {
  list.foldl(
    outputs,
    0,
    fn(output: Output, total: Lovelace) {
      if output.address.payment_credential == VerificationKey(who) {
        total + assets.lovelace_of(output.value)
      } else {
        total
      }
    },
  )
}

/// The earliest instant this transaction can be included in a block.
///
/// An unbounded lower bound means "any time from the dawn of the chain", which
/// can never establish that a claim date has passed — so it yields `None` and
/// the claim is refused rather than assumed valid.
pub fn earliest(self: Transaction) -> Option<Int> {
  when self.validity_range.lower_bound.bound_type is {
    Finite(now) -> Some(now)
    _ -> None
  }
}

/// The latest instant this transaction can be included in a block, when one is
/// stated. Cancelling uses this to *prove* it runs before the next claim falls
/// due; without an upper bound no such proof exists.
pub fn latest(self: Transaction) -> Option<Int> {
  when self.validity_range.upper_bound.bound_type is {
    Finite(deadline) -> Some(deadline)
    _ -> None
  }
}

/// The single output that returns funds to this same script, if there is one.
///
/// Insisting on exactly one continuing output closes the "double satisfaction"
/// hole where a transaction spends two subscriptions and points both at the
/// same continuation.
pub fn continuing_output(
  outputs: List<Output>,
  script: Address,
) -> Option<Output> {
  when list.filter(outputs, fn(output) { output.address == script }) is {
    [only] -> Some(only)
    _ -> None
  }
}

/// The terms the remainder must carry forward: identical in every respect
/// except that the claim date has moved on by exactly one period.
pub fn advanced(subscription: Subscription) -> Subscription {
  Subscription {
    ..subscription,
    next_claim_at: subscription.next_claim_at + subscription.period,
  }
}

validator membership {
  spend(
    datum: Option<Subscription>,
    redeemer: Action,
    own_ref: OutputReference,
    self: Transaction,
  ) {
    expect Some(subscription) = datum
    expect Some(own_input) = find_input(self.inputs, own_ref)

    let locked = assets.lovelace_of(own_input.output.value)
    let script = own_input.output.address

    when redeemer is {
      Claim -> {
        let remainder = locked - subscription.amount_per_period
        and {
          list.has(self.extra_signatories, subscription.creator),
          // The claim date must demonstrably have passed.
          when earliest(self) is {
            Some(now) -> now >= subscription.next_claim_at
            None -> False
          },
          subscription.amount_per_period > 0,
          // One period, no more: anything above this has to stay locked.
          paid_to_key(self.outputs, subscription.creator) >= subscription.amount_per_period,
          remainder >= 0,
          // Whatever is left continues under the same terms, one period later.
          if remainder > 0 {
            when continuing_output(self.outputs, script) is {
              Some(output) -> and {
                  assets.lovelace_of(output.value) >= remainder,
                  output.datum == InlineDatum(advanced(subscription)),
                }
              None -> False
            }
          } else {
            True
          },
        }
      }

      Cancel -> {
        // Walking away is free only while nothing is owed. To reclaim the whole
        // balance the supporter must bound the transaction to before the next
        // claim date; with no such bound the creator is paid that period first.
        let nothing_owed_yet =
          when latest(self) is {
            Some(deadline) -> deadline <= subscription.next_claim_at
            None -> False
          }
        and {
          list.has(self.extra_signatories, subscription.supporter),
          or {
            nothing_owed_yet,
            paid_to_key(self.outputs, subscription.creator) >= subscription.amount_per_period,
          },
        }
      }
    }
  }

  else(_) {
    fail @"membership: this script only handles spending"
  }
}
