import { CHAIN, ON_CHAIN_READY, feeDueLovelace } from "./chain";

/**
 * Single place for the site's own identity and outbound links.
 *
 * Replace the social handles and email with your real ones — every footer
 * link, contact link and share action reads from here, so one edit updates
 * the whole site.
 */
export const SITE = {
  name: "Support Ada",
  domain: "supportada.xyz",
  email: "hello@supportada.xyz",
  social: {
    twitter: "https://x.com/blockprint0",
    github: "https://github.com/BlockPrintio/Buy-Me-a-Coffee",
  },
  /** External references used across the footer and wallet help copy. */
  external: {
    cardanoDocs: "https://docs.cardano.org/",
    cip30: "https://cips.cardano.org/cip/CIP-30",
    explorer: "https://cardanoscan.io",
    cardanoStatus: "https://status.cardano.org/",
  },
} as const;

/**
 * Demo mode is not a switch any more — it is simply what happens when the
 * chain configuration is absent. Supply a Blockfrost project id and a platform
 * address (see `.env.example`) and the same checkout builds, signs and submits
 * a real transaction. Without them the flow is simulated and says so.
 */
export const DEMO_CHECKOUT = !ON_CHAIN_READY;

export const PLATFORM_RATE = CHAIN.feeBps / 10_000;

/**
 * A representative Cardano network fee, used only to set expectations on the
 * checkout screen. The real figure is computed by the wallet when it balances
 * the transaction, and it is paid to the network, not to us.
 */
export const NETWORK_FEE = 0.17;

/**
 * The breakdown shown at checkout, in ADA.
 *
 * The creator receives the amount chosen, in full — fees are added on top
 * rather than skimmed off, which is exactly how the transaction is built.
 *
 * `platformFee` mirrors the validator's own `fee_due`: a percentage cut of a
 * small tip falls below Cardano's min-UTxO deposit and therefore cannot exist
 * as an output at all, so it is waived rather than rounded up. The chain
 * enforces the same rule, which is why the two can never disagree.
 */
export function feeBreakdown(amount: number) {
  const platformFee =
    feeDueLovelace(Math.round(amount * 1_000_000)) / 1_000_000;
  const networkFee = NETWORK_FEE;
  return {
    platformFee,
    networkFee,
    totalFee: platformFee + networkFee,
    /** The creator is paid the full amount; nothing is deducted from it. */
    creatorReceives: amount,
    /** What leaves the supporter's wallet, network fee included. */
    totalPaid: amount + platformFee + networkFee,
    /** True when this support is small enough that we take nothing. */
    feeWaived: platformFee === 0,
  };
}
