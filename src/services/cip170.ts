/**
 * CIP-0170: KERI-backed metadata attestations.
 *
 * This module builds the *on-chain half* of the standard and nothing more. That
 * boundary matters, so it is worth stating plainly rather than discovering later.
 *
 * CIP-0170 does not define "prove you own this social handle". It embeds KERI
 * Autonomic Identifiers (AIDs) in transaction metadata, where the actual proof
 * lives in a Key Event Log (KEL) published off-chain and in a chain of ACDC
 * credentials rooted in some trust framework. An `ATTEST` record is only valid
 * if its digest is anchored in the signer's KEL at the stated sequence number.
 *
 * So a record produced here is a *reference to* a proof, never the proof. Write
 * one without a KEL behind it and you have put well-formed bytes on chain that
 * any conforming verifier will reject. Nothing in this file can, or pretends to,
 * verify anything: the CIP is explicit that validation happens off-chain through
 * indexers and KERI watcher networks, and that smart contracts cannot enforce
 * credential checks.
 *
 * Spec: https://github.com/cardano-foundation/CIPs/blob/master/CIP-0170/README.md
 */

/** The metadata label the standard fixes for these records. */
export const CIP170_LABEL = 170;

/** Version block. The CIP's own examples use these literals. */
export const CIP170_VERSION = "1.0";
export const KERI_VERSION = "KERI10";
export const ACDC_VERSION = "ACDC10";

/** Cardano caps a metadata string at 64 bytes once UTF-8 encoded. */
const MAX_METADATA_STRING_BYTES = 64;

const encoder = new TextEncoder();

function byteLength(value: string): number {
  return encoder.encode(value).length;
}

/**
 * Split a long value into ledger-legal pieces.
 *
 * A credential chain is a CESR byte-stream and will comfortably exceed a single
 * metadata string, so `c` is written as a list. Splitting on bytes rather than
 * characters keeps the pieces valid; a verifier concatenates them back in order.
 */
export function chunk(value: string): string[] {
  if (byteLength(value) <= MAX_METADATA_STRING_BYTES) return [value];
  const parts: string[] = [];
  let part = "";
  for (const char of value) {
    if (byteLength(part + char) > MAX_METADATA_STRING_BYTES) {
      parts.push(part);
      part = char;
    } else {
      part += char;
    }
  }
  if (part) parts.push(part);
  return parts;
}

/**
 * A CESR qb64 identifier is 44 characters of base64url with a one-character
 * derivation code in front. This is a shape check to catch a wrong field or a
 * truncated paste, not a cryptographic one.
 */
export function looksLikeQb64(value: string): boolean {
  return /^[A-Za-z0-9_-]{44}$/.test(value);
}

export interface AttestInput {
  /** AID of the signer, CESR qb64. */
  aid: string;
  /** Digest of the data being signed, CESR qb64. */
  digest: string;
  /** Sequence number of the anchoring KERI event. */
  sequenceNumber: number;
}

export interface AttestRecord {
  t: "ATTEST";
  i: string;
  d: string;
  s: string;
  v: { v: string };
}

/**
 * An `ATTEST` record: a persistent, verifiable signature over some data.
 *
 * The digest must already be anchored in the signer's KEL at `sequenceNumber`,
 * typically by an interaction event. Anchoring is what keeps the record
 * verifiable even after the controller rotates their keys.
 */
export function attestRecord({
  aid,
  digest,
  sequenceNumber,
}: AttestInput): AttestRecord {
  if (!looksLikeQb64(aid)) {
    throw new Error(`"${aid}" is not a CESR qb64 identifier.`);
  }
  if (!looksLikeQb64(digest)) {
    throw new Error(`"${digest}" is not a CESR qb64 digest.`);
  }
  if (!Number.isInteger(sequenceNumber) || sequenceNumber < 0) {
    throw new Error("A KERI sequence number is a non-negative integer.");
  }
  return {
    t: "ATTEST",
    i: aid,
    d: digest,
    // The CIP asks for the sequence number as a hex string.
    s: sequenceNumber.toString(16),
    v: { v: CIP170_VERSION },
  };
}

export interface AuthorityInput {
  /** AID of the signer, which must match the issuee of the leaf credential. */
  aid: string;
  /** Schema identifier of the leaf credential, CESR qb64. */
  schema: string;
  /** The credential chain (or revocation events) as a CESR byte-stream. */
  chain: string;
  /** Optional indexing block, per the CIP. */
  meta?: Record<string, string | number>;
}

export interface AuthorityRecord {
  t: "AUTH_BEGIN" | "AUTH_END";
  i: string;
  s: string;
  c: string[];
  v: { v: string; k: string; a: string };
  m?: Record<string, string | number>;
}

/**
 * `AUTH_BEGIN` establishes a signer's authority by publishing their credential
 * chain, and `AUTH_END` revokes it. Attestations only count between the two.
 */
function authorityRecord(
  t: "AUTH_BEGIN" | "AUTH_END",
  { aid, schema, chain, meta }: AuthorityInput,
): AuthorityRecord {
  if (!looksLikeQb64(aid)) {
    throw new Error(`"${aid}" is not a CESR qb64 identifier.`);
  }
  if (!looksLikeQb64(schema)) {
    throw new Error(`"${schema}" is not a CESR qb64 schema identifier.`);
  }
  if (!chain) throw new Error("A credential chain byte-stream is required.");

  const record: AuthorityRecord = {
    t,
    i: aid,
    s: schema,
    c: chunk(chain),
    v: { v: CIP170_VERSION, k: KERI_VERSION, a: ACDC_VERSION },
  };
  if (meta) record.m = meta;
  return record;
}

export const authBeginRecord = (input: AuthorityInput) =>
  authorityRecord("AUTH_BEGIN", input);

export const authEndRecord = (input: AuthorityInput) =>
  authorityRecord("AUTH_END", input);

/** The metadata entry to attach, keyed by the standard's label. */
export function cip170Metadata(
  record: AttestRecord | AuthorityRecord,
): Record<number, AttestRecord | AuthorityRecord> {
  return { [CIP170_LABEL]: record };
}
