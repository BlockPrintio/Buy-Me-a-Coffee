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
    twitter: "https://x.com/supportada",
    github: "https://github.com/supportada",
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
 * This build ships the full product flow but has no transaction backend: a
 * real send needs a serialization library (lucid-cardano / CSL) plus a chain
 * provider such as Blockfrost. Wallet connection, balance and network reads
 * below are genuine CIP-30 calls; the transfer itself is simulated and every
 * screen that touches it says so. Flip this off once a signer is wired up.
 */
export const DEMO_CHECKOUT = true;

export const PLATFORM_RATE = 0.025;
export const NETWORK_FEE = 0.17;

export function feeBreakdown(amount: number) {
  const platformFee = amount * PLATFORM_RATE;
  const networkFee = NETWORK_FEE;
  return {
    platformFee,
    networkFee,
    totalFee: platformFee + networkFee,
    creatorReceives: Math.max(0, amount - platformFee - networkFee),
  };
}
