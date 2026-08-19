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
  /**
   * The Catalyst Pilot issues selected projects a standard metadata label so
   * their activity appears on the public dashboard and the Cardano
   * leaderboard. Set it once accepted and every transaction carries it; leave
   * it unset and transactions still carry our own app label, so a Dune query
   * works either way.
   */
  pilotLabel: Number(env("VITE_PILOT_METADATA_LABEL") || 0) || undefined,

  /**
   * The stablecoin this deployment settles in, when a creator chooses to be
   * paid in one.
   *
   * Both halves are needed: an issuer can mint many assets under one policy, so
   * the asset name is what distinguishes the stablecoin from everything else
   * that issuer has ever minted. The validator checks both.
   */
  stablecoin: {
    policyId: env("VITE_STABLECOIN_POLICY"),
    assetNameHex: env("VITE_STABLECOIN_NAME"),
    /** USDC and USDM both use six. Only affects display, never the ledger. */
    decimals: Number(env("VITE_STABLECOIN_DECIMALS") || 6),
    label: env("VITE_STABLECOIN_LABEL") || "USDC",
  },

  /**
   * The smallest stablecoin fee worth taking as its own output, in the token's
   * smallest unit.
   *
   * Deliberately separate from the ada floor. An output carrying a token has to
   * lock up more ada than a plain one, roughly 1.2 to 1.4 against 0.86, because
   * min-UTxO scales with output size and a token adds a policy id, an asset
   * name and a quantity. A token fee therefore has to be worth more than the
   * ada it strands, and no on-chain code can work that out without a rate.
   */
  minFeeToken: Number(env("VITE_MIN_FEE_TOKEN") || 1_000_000),
} as const;

/** True when a creator can actually choose stablecoin settlement. */
export const STABLECOIN_READY =
  CHAIN.stablecoin.policyId !== "" && CHAIN.stablecoin.assetNameHex !== "";

/**
 * Issuers this deployment will settle in, as the validator's `accepted`
 * parameter. Part of the policy id, so adding one is a redeployment, not a
 * config change.
 */
export const ACCEPTED_POLICIES: string[] = STABLECOIN_READY
  ? [CHAIN.stablecoin.policyId]
  : [];

/** The stablecoin unit as `policyId + assetNameHex`, which is how Lucid keys assets. */
export const STABLECOIN_UNIT =
  CHAIN.stablecoin.policyId + CHAIN.stablecoin.assetNameHex;

/**
 * The fee due on a stablecoin support, in the token's smallest unit.
 * Mirrors `fee_due` in the validator against the token floor rather than the
 * ada one, so the checkout and the chain agree here too.
 */
export function feeDueToken(amount: number): number {
  const fee = Math.floor((amount * CHAIN.feeBps) / 10_000);
  return fee >= CHAIN.minFeeToken ? fee : 0;
}

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
