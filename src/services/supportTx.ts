/**
 * Builds, signs and submits a real support transaction.
 *
 * One transaction does all three things at once: it pays the creator, pays the
 * platform whatever fee is actually due, and mints a single receipt token from
 * the Aiken policy in `contracts/`. The policy refuses to mint unless the first
 * two hold, so a receipt in a supporter's wallet is proof the split was
 * honoured — the ledger would have rejected the transaction otherwise.
 *
 * Nothing is ever locked at a script address; the ADA moves straight from
 * supporter to creator, which is what keeps this non-custodial.
 */

import {
  Blockfrost,
  Constr,
  Data,
  Lucid,
  applyParamsToScript,
  fromText,
  getAddressDetails,
  mintingPolicyToId,
  type LucidEvolution,
  type MintingPolicy,
  type Network,
} from "@lucid-evolution/lucid";

import blueprint from "../contracts/plutus.json";
import {
  BLOCKFROST_URL,
  CHAIN,
  EXPECTED_NETWORK_ID,
  MIN_SUPPORT_ADA,
  MIN_SUPPORT_LOVELACE,
  ON_CHAIN_READY,
  feeDueLovelace,
} from "../config/chain";
import type { WalletAPI } from "./cardanoWallet";
import { randomHex } from "../lib/utils";

/** Raised for problems worth showing the supporter verbatim. */
export class SupportTxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupportTxError";
  }
}

const VALIDATOR_TITLE = "support.receipt.mint";

function compiledCode(): string {
  const validator = blueprint.validators.find(
    (v) => v.title === VALIDATOR_TITLE,
  );
  if (!validator) {
    throw new SupportTxError(
      `The compiled contract is missing "${VALIDATOR_TITLE}". Run \`npm run contracts:build\`.`,
    );
  }
  return validator.compiledCode;
}

/**
 * A bech32 address as Plutus `Credential`: constructor 0 for a public key,
 * constructor 1 for a script. This has to match `cardano/address.Credential`
 * in the validator byte for byte, or the applied policy id will not be the one
 * the chain evaluates.
 */
function toPlutusCredential(address: string): Constr<string> {
  let details;
  try {
    details = getAddressDetails(address);
  } catch {
    throw new SupportTxError(`"${address}" is not a valid Cardano address.`);
  }

  const credential = details.paymentCredential;
  if (!credential) {
    throw new SupportTxError(
      `"${address}" has no payment credential, so it cannot receive support.`,
    );
  }

  return new Constr(credential.type === "Key" ? 0 : 1, [credential.hash]);
}

/**
 * The receipt policy with this deployment's terms baked in.
 *
 * Changing the platform address, the rate or the waiver threshold produces a
 * different policy id, so receipts stay verifiable under the exact terms they
 * were minted with.
 */
export function receiptPolicy(): MintingPolicy {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(compiledCode(), [
      toPlutusCredential(CHAIN.platformAddress),
      BigInt(CHAIN.feeBps),
      BigInt(CHAIN.minFeeLovelace),
    ]),
  };
}

export function receiptPolicyId(): string {
  return mintingPolicyToId(receiptPolicy());
}

/** `Support { creator, amount }` — constructor 0 of the validator's `Action`. */
function supportRedeemer(creatorAddress: string, lovelace: bigint): string {
  return Data.to(new Constr(0, [toPlutusCredential(creatorAddress), lovelace]));
}

/** CIP-20: "at most 64 bytes when UTF-8 encoded", per message-string. */
const CIP20_LINE_BYTES = 64;

const encoder = new TextEncoder();

function byteLength(value: string): number {
  return encoder.encode(value).length;
}

/**
 * Split a single over-long word into pieces that each fit the byte budget.
 *
 * Iterating code points rather than UTF-16 units keeps astral characters —
 * emoji, most CJK extensions — whole; cutting one in half would produce a lone
 * surrogate that no longer encodes as valid UTF-8.
 */
function chunkToBytes(word: string, budget: number): string[] {
  const chunks: string[] = [];
  let chunk = "";

  for (const char of word) {
    if (byteLength(chunk + char) > budget) {
      chunks.push(chunk);
      chunk = char;
    } else {
      chunk += char;
    }
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

/**
 * CIP-20 transaction message.
 *
 * The limit the standard sets is 64 *bytes*, not 64 characters — a message in
 * Japanese or one carrying emoji hits it after ~21 characters. Lines are
 * wrapped on word boundaries where possible and split mid-word only when a
 * single word cannot fit, so nothing is dropped either way.
 */
function messageMetadata(message: string): string[] {
  const words = message.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (byteLength(candidate) <= CIP20_LINE_BYTES) {
      line = candidate;
      continue;
    }

    if (line) {
      lines.push(line);
      line = "";
    }

    if (byteLength(word) <= CIP20_LINE_BYTES) {
      line = word;
      continue;
    }

    // Carry the tail forward so the next word can still join it.
    const pieces = chunkToBytes(word, CIP20_LINE_BYTES);
    lines.push(...pieces.slice(0, -1));
    line = pieces[pieces.length - 1];
  }

  if (line) lines.push(line);
  return lines;
}

/** The ledger caps an asset name at 32 bytes of the decoded name. */
const MAX_ASSET_NAME_BYTES = 32;

/**
 * A receipt name unique per support, so each one is a distinct NFT rather than
 * another unit of a fungible token.
 *
 * The timestamp alone is not enough: two supports to the same creator inside
 * one second would produce the same name, and the second mint would quietly
 * become a second unit of an existing asset — fungible, and no longer an NFT.
 * Four bytes of entropy settle it. The handle is then clamped by bytes, not
 * characters, so a non-ASCII handle cannot push the name past the ledger cap.
 */
function receiptAssetName(creatorHandle: string): string {
  const suffix = `-${Math.floor(Date.now() / 1000).toString(16)}${randomHex(8)}`;
  const [prefix = ""] = chunkToBytes(
    creatorHandle,
    MAX_ASSET_NAME_BYTES - byteLength(suffix),
  );
  return fromText(`${prefix}${suffix}`);
}

/**
 * A Lucid instance bound to the configured provider and the caller's wallet.
 *
 * Shared with the membership flow so both build against one provider and one
 * network definition rather than drifting apart.
 */
export async function connectLucid(
  walletApi: WalletAPI,
): Promise<LucidEvolution> {
  const lucid = await Lucid(
    new Blockfrost(BLOCKFROST_URL[CHAIN.network], CHAIN.blockfrostProjectId),
    CHAIN.network as Network,
  );
  lucid.selectWallet.fromAPI(walletApi as never);
  return lucid;
}

/**
 * The two conditions every on-chain action shares: the deployment has to be
 * configured, and the wallet has to be on the network this build targets.
 *
 * The network check matters most — without it a preprod-configured site would
 * happily hand a mainnet wallet a transaction to sign.
 */
export function requireOnChain(walletNetworkId: number | null): void {
  if (!ON_CHAIN_READY) {
    throw new SupportTxError(
      "On-chain support is not configured. Set VITE_BLOCKFROST_PROJECT_ID and VITE_PLATFORM_ADDRESS.",
    );
  }

  if (walletNetworkId !== null && walletNetworkId !== EXPECTED_NETWORK_ID) {
    throw new SupportTxError(
      `Your wallet is on ${walletNetworkId === 1 ? "mainnet" : "a testnet"}, but this site is configured for ${CHAIN.network}. Switch networks in your wallet and reconnect.`,
    );
  }
}

export interface SendSupportInput {
  walletApi: WalletAPI;
  creatorAddress: string;
  creatorHandle: string;
  amountAda: number;
  message?: string;
  walletNetworkId: number | null;
}

export interface SendSupportResult {
  txHash: string;
  /** Lovelace actually paid to the platform — zero when the fee is waived. */
  feePaid: number;
  receiptUnit: string;
}

export async function sendSupport({
  walletApi,
  creatorAddress,
  creatorHandle,
  amountAda,
  message,
  walletNetworkId,
}: SendSupportInput): Promise<SendSupportResult> {
  requireOnChain(walletNetworkId);

  if (!Number.isFinite(amountAda) || amountAda <= 0) {
    throw new SupportTxError("Enter a support amount greater than zero.");
  }

  const amountLovelace = BigInt(Math.round(amountAda * 1_000_000));

  // The creator's output has to clear the ledger's minimum-ada deposit like
  // any other. Rejecting it here beats letting the wallet raise a signing
  // prompt for a transaction that can never be built.
  if (amountLovelace < BigInt(MIN_SUPPORT_LOVELACE)) {
    throw new SupportTxError(
      `Cardano will not create an output below its minimum-ada deposit, so ₳${MIN_SUPPORT_ADA} is the smallest support that can settle on-chain.`,
    );
  }
  const feeLovelace = BigInt(feeDueLovelace(Number(amountLovelace)));

  const policy = receiptPolicy();
  const policyId = mintingPolicyToId(policy);
  const unit = policyId + receiptAssetName(creatorHandle);

  const lucid = await connectLucid(walletApi);

  let tx = lucid
    .newTx()
    .pay.ToAddress(creatorAddress, { lovelace: amountLovelace })
    .mintAssets({ [unit]: 1n }, supportRedeemer(creatorAddress, amountLovelace))
    .attach.MintingPolicy(policy);

  // Only create the fee output when one is genuinely due; an output below the
  // min-UTxO deposit cannot exist, and the validator waives it for the same
  // reason.
  if (feeLovelace > 0n) {
    tx = tx.pay.ToAddress(CHAIN.platformAddress, { lovelace: feeLovelace });
  }

  const lines = message ? messageMetadata(message) : [];
  if (lines.length > 0) {
    tx = tx.attachMetadata(674, { msg: lines });
  }

  try {
    const completed = await tx.complete();
    const signed = await completed.sign.withWallet().complete();
    const txHash = await signed.submit();
    return { txHash, feePaid: Number(feeLovelace), receiptUnit: unit };
  } catch (error) {
    throw new SupportTxError(explainTxFailure(error));
  }
}

/**
 * Wallet and provider errors arrive as anything from a string to a nested
 * object. Turn the common ones into something a supporter can act on.
 */
function explainTxFailure(error: unknown): string {
  const raw =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : JSON.stringify(error ?? "");

  const text = raw.toLowerCase();

  if (
    text.includes("declined") ||
    text.includes("user denied") ||
    text.includes("refused")
  ) {
    return "You declined the signature, so nothing was sent.";
  }
  if (text.includes("insufficient") || text.includes("inputsexhausted")) {
    return "Not enough ADA in the wallet to cover the support plus the network fee.";
  }
  if (text.includes("utxo") && text.includes("balance")) {
    return "Your wallet could not assemble enough UTxOs for this amount. Try a smaller support.";
  }
  if (
    text.includes("project_id") ||
    text.includes("403") ||
    text.includes("401")
  ) {
    return "The Blockfrost project id was rejected. Check it matches the configured network.";
  }
  return raw || "The transaction could not be submitted.";
}
