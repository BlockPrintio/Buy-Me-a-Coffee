/**
 * Transaction metadata that makes activity countable off-chain.
 *
 * The Pilot measures usage in network fees, and the Foundation's announcement
 * says evaluation favours projects that leverage existing Dune dashboards. Both
 * require the same thing: every transaction this app produces has to be
 * identifiable and classifiable from chain data alone, without a private index.
 *
 * So each transaction carries a small structured record under a fixed metadata
 * label. A Dune query can then select on `app`, group by `act`, and count
 * transactions or sum fees without any cooperation from us. Nothing here is
 * needed to make a payment work; it exists purely so the numbers are public and
 * anyone can recompute them.
 *
 * Cardano metadata strings are capped at 64 bytes, so keys and values are kept
 * short deliberately rather than for style.
 */

/**
 * Application label. Registered metadata labels are a first-come convention
 * rather than an allocation, so this is a fixed arbitrary number, documented
 * here so a Dune query and this file cannot drift apart.
 */
export const APP_METADATA_LABEL = 5842;

/** Schema version, so a dashboard can tell old records from new ones. */
export const SCHEMA_VERSION = 1;

/** Short app id. Every record carries it so one query can find all activity. */
export const APP_ID = "support-ada";

export type TxAction =
  | "support"
  | "membership_start"
  | "membership_claim"
  | "membership_cancel";

export interface TxRecord {
  /** Schema version. */
  v: number;
  /** Application id. */
  app: string;
  /** What the transaction did. */
  act: TxAction;
  /** Value moved to the creator, in the smallest unit of `unit`. */
  amt: number;
  /** `lovelace`, or the asset the creator was actually paid in. */
  unit: string;
  /** Platform fee collected, in lovelace. Zero when the fee is waived. */
  fee: number;
  /** Creator handle, so a dashboard can break activity down per creator. */
  cr?: string;
}

/** Cardano caps a metadata string at 64 bytes once UTF-8 encoded. */
const MAX_METADATA_STRING_BYTES = 64;

const encoder = new TextEncoder();

function clampToBytes(value: string, budget: number): string {
  if (encoder.encode(value).length <= budget) return value;
  let out = "";
  for (const char of value) {
    if (encoder.encode(out + char).length > budget) break;
    out += char;
  }
  return out;
}

/**
 * Build the record for one transaction.
 *
 * `creatorHandle` is clamped by bytes rather than characters so a non-ASCII
 * handle cannot push the field past the ledger limit and fail the submission.
 */
export function buildTxRecord(input: {
  action: TxAction;
  amount: number;
  unit?: string;
  fee?: number;
  creatorHandle?: string;
}): TxRecord {
  const record: TxRecord = {
    v: SCHEMA_VERSION,
    app: APP_ID,
    act: input.action,
    amt: Math.round(input.amount),
    unit: clampToBytes(input.unit ?? "lovelace", MAX_METADATA_STRING_BYTES),
    fee: Math.round(input.fee ?? 0),
  };
  if (input.creatorHandle) {
    record.cr = clampToBytes(input.creatorHandle, MAX_METADATA_STRING_BYTES);
  }
  return record;
}

/**
 * The metadata map to attach, keyed by label.
 *
 * The Pilot supplies its own standard label to selected projects so activity
 * appears on its public dashboard and the Cardano leaderboard. When that label
 * is configured the same record is written under it as well, so one transaction
 * satisfies both the Pilot's dashboard and our own without a second write.
 */
export type MetadataMap = Record<string, string | number>;

/** The record as the flat scalar map the ledger actually stores. */
export function toMetadata(record: TxRecord): MetadataMap {
  const out: MetadataMap = {
    v: record.v,
    app: record.app,
    act: record.act,
    amt: record.amt,
    unit: record.unit,
    fee: record.fee,
  };
  if (record.cr) out.cr = record.cr;
  return out;
}

export function metadataFor(
  record: TxRecord,
  pilotLabel?: number,
): Record<number, MetadataMap> {
  const flat = toMetadata(record);
  const entries: Record<number, MetadataMap> = { [APP_METADATA_LABEL]: flat };
  if (pilotLabel && Number.isInteger(pilotLabel) && pilotLabel > 0) {
    entries[pilotLabel] = flat;
  }
  return entries;
}
