/**
 * On-chain configuration.
 *
 * The app ships able to run in two modes. With no configuration it stays in
 * demo mode: wallet connection, balances and network reads are genuine CIP-30
 * calls, but the support itself is simulated and every screen says so. Fill in
 * the variables below (see `.env.example`) and the same flow builds, signs and
 * submits a real Cardano transaction instead.
 */

export type CardanoNetwork = "Mainnet" | "Preprod" | "Preview";

function env(key: string): string {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return typeof value === "string" ? value.trim() : "";
}

const network = (env("VITE_CARDANO_NETWORK") || "Preprod") as CardanoNetwork;

export const CHAIN = {
  network,
  /** Blockfrost project id, scoped to the same network as above. */
  blockfrostProjectId: env("VITE_BLOCKFROST_PROJECT_ID"),
  /** Bech32 address that collects the platform fee. */
  platformAddress: env("VITE_PLATFORM_ADDRESS"),
  /** Platform cut in basis points. 250 = 2.5%. The validator caps this at 10%. */
  feeBps: Number(env("VITE_FEE_BPS") || 250),
  /**
   * Smallest fee worth paying as its own output, in lovelace.
   *
   * Cardano will not create an output below the min-UTxO deposit, so a
   * percentage cut of a small tip is unpayable rather than merely tiny. Below
   * this figure the fee is waived outright — the validator enforces the same
   * rule, so the chain agrees with the checkout screen.
   */
  minFeeLovelace: Number(env("VITE_MIN_FEE_LOVELACE") || 1_000_000),
} as const;

/**
 * The smallest support that can exist on-chain, in lovelace.
 *
 * The creator's output is subject to the same minimum-ada deposit as any
 * other: `(160 + sizeInBytes(TxOut)) × coinsPerUTxOByte`, which lands around
 * 0.86 ADA for a plain ada-only output at the current `coinsPerUTxOByte` of
 * 4310. Anything under that is not a small payment — it is a transaction the
 * ledger refuses to construct. One ADA leaves headroom and is a friendlier
 * number to state on the checkout screen.
 *
 * https://docs.cardano.org/native-tokens/minimum-ada-value-requirement/
 */
export const MIN_SUPPORT_LOVELACE = 1_000_000;

export const MIN_SUPPORT_ADA = MIN_SUPPORT_LOVELACE / 1_000_000;

/** Network id as CIP-30 reports it: 1 for mainnet, 0 for any testnet. */
export const EXPECTED_NETWORK_ID = CHAIN.network === "Mainnet" ? 1 : 0;

export const BLOCKFROST_URL: Record<CardanoNetwork, string> = {
  Mainnet: "https://cardano-mainnet.blockfrost.io/api/v0",
  Preprod: "https://cardano-preprod.blockfrost.io/api/v0",
  Preview: "https://cardano-preview.blockfrost.io/api/v0",
};

export const EXPLORER_URL: Record<CardanoNetwork, string> = {
  Mainnet: "https://cardanoscan.io",
  Preprod: "https://preprod.cardanoscan.io",
  Preview: "https://preview.cardanoscan.io",
};

/** True when a real transaction can actually be built and submitted. */
export const ON_CHAIN_READY =
  CHAIN.blockfrostProjectId !== "" && CHAIN.platformAddress !== "";

export function explorerTxUrl(txHash: string): string {
  return `${EXPLORER_URL[CHAIN.network]}/transaction/${txHash}`;
}

/**
 * What the platform actually collects on a given support, mirroring
 * `fee_due` in the validator exactly. If these two ever disagree, the wallet
 * builds a transaction the chain then rejects.
 */
export function feeDueLovelace(amountLovelace: number): number {
  const fee = Math.floor((amountLovelace * CHAIN.feeBps) / 10_000);
  return fee >= CHAIN.minFeeLovelace ? fee : 0;
}

/** The support amount at which the platform fee starts applying, in ADA. */
export const FEE_THRESHOLD_ADA = Math.ceil(
  (CHAIN.minFeeLovelace * 10_000) / CHAIN.feeBps / 1_000_000,
);
