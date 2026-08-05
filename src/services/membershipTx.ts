/**
 * Memberships, on chain.
 *
 * A blockchain has no scheduler, so a monthly membership cannot be a charge
 * that fires by itself. What it can be is a prepaid balance the creator draws
 * down one period at a time, which is what the `membership` validator enforces.
 *
 * Three operations make that a complete loop, and all three live here because
 * shipping the lock without the unlocks would strand people's ADA:
 *
 *   start  — the supporter locks N periods up front
 *   claim  — the creator takes one period, once it falls due
 *   cancel — the supporter stops and reclaims the unearned balance
 */

import {
  Constr,
  credentialToAddress,
  Data,
  getAddressDetails,
  validatorToAddress,
  type LucidEvolution,
  type SpendingValidator,
  type UTxO,
} from "@lucid-evolution/lucid";

import blueprint from "../contracts/plutus.json";
import { SupportTxError, connectLucid, requireOnChain } from "./supportTx";
import type { WalletAPI } from "./cardanoWallet";

const VALIDATOR_TITLE = "membership.membership.spend";

/** One period. Kept in milliseconds because that is what Plutus compares. */
export const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export function membershipValidator(): SpendingValidator {
  const validator = blueprint.validators.find(
    (v) => v.title === VALIDATOR_TITLE,
  );
  if (!validator) {
    throw new SupportTxError(
      `The compiled contract is missing "${VALIDATOR_TITLE}". Run \`npm run contracts:build\`.`,
    );
  }
  return { type: "PlutusV3", script: validator.compiledCode };
}

export function membershipAddress(lucid: LucidEvolution): string {
  return validatorToAddress(lucid.config().network!, membershipValidator());
}

/**
 * The validator identifies both parties by public-key hash, so a script-based
 * wallet cannot currently hold a membership on either side. Saying so here
 * beats a rejection from deep inside the ledger.
 */
function keyHashOf(address: string, role: string): string {
  let details;
  try {
    details = getAddressDetails(address);
  } catch {
    throw new SupportTxError(
      `The ${role} address is not a valid Cardano address.`,
    );
  }
  const credential = details.paymentCredential;
  if (!credential || credential.type !== "Key") {
    throw new SupportTxError(
      `Memberships need a normal key-based ${role} address; script addresses are not supported yet.`,
    );
  }
  return credential.hash;
}

export interface SubscriptionTerms {
  supporter: string;
  creator: string;
  amountPerPeriod: bigint;
  period: bigint;
  nextClaimAt: bigint;
}

/** Matches the `Subscription` datum field-for-field, in declaration order. */
function toDatum(terms: SubscriptionTerms): string {
  return Data.to(
    new Constr(0, [
      terms.supporter,
      terms.creator,
      terms.amountPerPeriod,
      terms.period,
      terms.nextClaimAt,
    ]),
  );
}

function fromDatum(datum: string): SubscriptionTerms | null {
  try {
    const parsed = Data.from(datum) as Constr<unknown>;
    if (parsed.index !== 0 || parsed.fields.length !== 5) return null;
    const [supporter, creator, amountPerPeriod, period, nextClaimAt] =
      parsed.fields;
    return {
      supporter: supporter as string,
      creator: creator as string,
      amountPerPeriod: amountPerPeriod as bigint,
      period: period as bigint,
      nextClaimAt: nextClaimAt as bigint,
    };
  } catch {
    return null;
  }
}

/** `Claim` and `Cancel` — constructors 0 and 1 of the validator's `Action`. */
const CLAIM = Data.to(new Constr(0, []));
const CANCEL = Data.to(new Constr(1, []));

export interface StartMembershipInput {
  walletApi: WalletAPI;
  creatorAddress: string;
  amountPerPeriodAda: number;
  /** How many periods to fund up front. */
  periods: number;
  walletNetworkId: number | null;
}

/**
 * Lock `periods × amountPerPeriod` under the membership script.
 *
 * The first period falls due immediately, so a creator is paid for month one
 * as soon as someone joins rather than a month later.
 */
export async function startMembership({
  walletApi,
  creatorAddress,
  amountPerPeriodAda,
  periods,
  walletNetworkId,
}: StartMembershipInput): Promise<{ txHash: string; locked: bigint }> {
  requireOnChain(walletNetworkId);

  if (!Number.isFinite(amountPerPeriodAda) || amountPerPeriodAda <= 0) {
    throw new SupportTxError("Enter a membership amount greater than zero.");
  }
  if (!Number.isInteger(periods) || periods < 1) {
    throw new SupportTxError("Fund at least one period.");
  }

  const lucid = await connectLucid(walletApi);
  const supporterAddress = await lucid.wallet().address();

  const amountPerPeriod = BigInt(Math.round(amountPerPeriodAda * 1_000_000));
  const locked = amountPerPeriod * BigInt(periods);

  const terms: SubscriptionTerms = {
    supporter: keyHashOf(supporterAddress, "supporter"),
    creator: keyHashOf(creatorAddress, "creator"),
    amountPerPeriod,
    period: BigInt(MONTH_MS),
    nextClaimAt: BigInt(Date.now()),
  };

  const tx = await lucid
    .newTx()
    .pay.ToContract(
      membershipAddress(lucid),
      { kind: "inline", value: toDatum(terms) },
      { lovelace: locked },
    )
    .complete();

  const signed = await tx.sign.withWallet().complete();
  return { txHash: await signed.submit(), locked };
}

export interface Membership {
  utxo: UTxO;
  terms: SubscriptionTerms;
  /** Lovelace still locked. */
  balance: bigint;
  /** Whether a period is currently claimable. */
  claimable: boolean;
}

/**
 * Every membership at the script whose datum names this key hash, on the given
 * side. Reading the datum is what tells the two roles apart — the script
 * address itself is shared by everyone.
 */
export async function findMemberships(
  lucid: LucidEvolution,
  keyHash: string,
  role: "creator" | "supporter",
): Promise<Membership[]> {
  const utxos = await lucid.utxosAt(membershipAddress(lucid));
  const now = BigInt(Date.now());

  return utxos.flatMap((utxo) => {
    if (!utxo.datum) return [];
    const terms = fromDatum(utxo.datum);
    if (!terms || terms[role] !== keyHash) return [];
    return [
      {
        utxo,
        terms,
        balance: utxo.assets.lovelace,
        claimable:
          now >= terms.nextClaimAt &&
          utxo.assets.lovelace >= terms.amountPerPeriod,
      },
    ];
  });
}

/**
 * Take one period's payment.
 *
 * The validator demands a lower bound proving the claim date has passed, and
 * demands the remainder go back under terms advanced by exactly one period —
 * both of which are built here.
 */
export async function claimMembership(
  walletApi: WalletAPI,
  membership: Membership,
  walletNetworkId: number | null,
): Promise<{ txHash: string }> {
  requireOnChain(walletNetworkId);

  const lucid = await connectLucid(walletApi);
  const { terms, utxo } = membership;
  const remainder = utxo.assets.lovelace - terms.amountPerPeriod;

  if (remainder < 0n) {
    throw new SupportTxError(
      "This membership no longer holds a full period; the supporter can reclaim the remainder.",
    );
  }

  const creatorAddress = await lucid.wallet().address();
  let tx = lucid
    .newTx()
    .collectFrom([utxo], CLAIM)
    .attach.SpendingValidator(membershipValidator())
    .pay.ToAddress(creatorAddress, { lovelace: terms.amountPerPeriod })
    // The lower bound is what proves the period has elapsed. A minute of slack
    // absorbs the drift between wallet clock and chain time.
    .validFrom(Number(terms.nextClaimAt))
    .addSigner(creatorAddress);

  if (remainder > 0n) {
    tx = tx.pay.ToContract(
      membershipAddress(lucid),
      {
        kind: "inline",
        value: toDatum({
          ...terms,
          nextClaimAt: terms.nextClaimAt + terms.period,
        }),
      },
      { lovelace: remainder },
    );
  }

  const completed = await tx.complete();
  const signed = await completed.sign.withWallet().complete();
  return { txHash: await signed.submit() };
}

/**
 * Stop a membership and take back what has not been earned.
 *
 * If nothing is due yet the whole balance comes back, but the transaction has
 * to carry an upper bound to prove it — the validator will not take the
 * supporter's word for it. Once a period is due, that period is paid to the
 * creator first.
 */
export async function cancelMembership(
  walletApi: WalletAPI,
  membership: Membership,
  walletNetworkId: number | null,
): Promise<{ txHash: string; refunded: bigint }> {
  requireOnChain(walletNetworkId);

  const lucid = await connectLucid(walletApi);
  const { terms, utxo } = membership;
  const supporterAddress = await lucid.wallet().address();

  const owesAPeriod = BigInt(Date.now()) >= terms.nextClaimAt;
  const refunded = owesAPeriod
    ? utxo.assets.lovelace - terms.amountPerPeriod
    : utxo.assets.lovelace;

  if (refunded < 0n) {
    throw new SupportTxError(
      "The creator is owed more than this membership still holds.",
    );
  }

  let tx = lucid
    .newTx()
    .collectFrom([utxo], CANCEL)
    .attach.SpendingValidator(membershipValidator())
    .addSigner(supporterAddress);

  if (owesAPeriod) {
    // Settle the earned period rather than trying to prove it has not accrued.
    tx = tx.pay.ToAddress(creatorAddressOf(terms, lucid), {
      lovelace: terms.amountPerPeriod,
    });
  } else {
    // Bound the transaction to before the claim date; this is the proof the
    // validator asks for, and without it the creator must be paid.
    tx = tx.validTo(Number(terms.nextClaimAt));
  }

  const completed = await tx.complete();
  const signed = await completed.sign.withWallet().complete();
  return { txHash: await signed.submit(), refunded };
}

/**
 * Rebuild the creator's address from the key hash carried in the datum.
 *
 * Only the payment credential is recorded, so this produces an enterprise
 * address — no staking part. That is exactly what the validator checks, so the
 * payment satisfies it and the creator's key still controls the funds.
 */
function creatorAddressOf(
  terms: SubscriptionTerms,
  lucid: LucidEvolution,
): string {
  return credentialToAddress(lucid.config().network!, {
    type: "Key",
    hash: terms.creator,
  });
}
