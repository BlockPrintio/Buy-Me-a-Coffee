/**
 * The demo creator directory. One source of truth for the support card, the
 * testimonials and the "Browse creators" list, so a support sent from any of
 * them lands on the same profile.
 */
export interface Creator {
  id: string;
  handle: string;
  name: string;
  role: string;
  initials: string;
  tint: string;
  bio: string;
  category: "developer" | "artist" | "spo" | "educator" | "other";
  walletAddress: string;
  /** Seed totals — live supports made in this session are added on top. */
  baseEarned: number;
  baseSupporters: number;
  verified: boolean;
}

export const CREATORS: Creator[] = [
  {
    id: "luna-dev",
    handle: "lunadev",
    name: "Luna Dev",
    role: "Plutus smart contract developer",
    initials: "LD",
    tint: "bg-brand-700",
    bio: "Aiken and Plutus tutorials, open-source validators, and a weekly deep dive into Cardano tooling.",
    category: "developer",
    walletAddress:
      "addr1qy2jt0qpqz2z2z9zx5w4v6t0q8s9k3n7m5c4x2v8b6n4m2q9w7e5r3t1y8u6i4o2p0a8s6d4f2g0h8j6k4l2z9x7c5v3b1n",
    baseEarned: 250,
    baseSupporters: 42,
    verified: true,
  },
  {
    id: "pete-rivera",
    handle: "priveraudit",
    name: "Pete Rivera",
    role: "Smart contract auditor",
    initials: "PR",
    tint: "bg-brand-500",
    bio: "Independent audits for Cardano DeFi. Public reports, no retainers, funded entirely by the community.",
    category: "developer",
    walletAddress:
      "addr1q9k3n7m5c4x2v8b6n4m2q9w7e5r3t1y8u6i4o2p0a8s6d4f2g0h8j6k4l2z9x7c5v3b1n2jt0qpqz2z2z9zx5w4v6t0q8s",
    baseEarned: 1840,
    baseSupporters: 318,
    verified: true,
  },
  {
    id: "sarah-johnson",
    handle: "sarahmints",
    name: "Sarah Johnson",
    role: "NFT artist",
    initials: "SJ",
    tint: "bg-accent-600",
    bio: "Hand-drawn generative collections, minted on Cardano. Members get first look at every drop.",
    category: "artist",
    walletAddress:
      "addr1qv3b1n2jt0qpqz2z2z9zx5w4v6t0q8s9k3n7m5c4x2v8b6n4m2q9w7e5r3t1y8u6i4o2p0a8s6d4f2g0h8j6k4l2z9x7c5",
    baseEarned: 920,
    baseSupporters: 92,
    verified: true,
  },
  {
    id: "mira-okafor",
    handle: "mirateaches",
    name: "Mira Okafor",
    role: "Cardano educator",
    initials: "MO",
    tint: "bg-ink-700",
    bio: "Plain-language explainers for people who are new to Cardano. Free forever, funded by supporters.",
    category: "educator",
    walletAddress:
      "addr1q8s6d4f2g0h8j6k4l2z9x7c5v3b1n2jt0qpqz2z2z9zx5w4v6t0q8s9k3n7m5c4x2v8b6n4m2q9w7e5r3t1y8u6i4o2p0a",
    baseEarned: 610,
    baseSupporters: 128,
    verified: false,
  },
  {
    id: "dan-halvorsen",
    handle: "hexpool",
    name: "Dan Halvorsen",
    role: "Stake pool operator · [HEX]",
    initials: "DH",
    tint: "bg-brand-800",
    bio: "Single-operator pool running on renewable power, with monthly transparency reports for delegators.",
    category: "spo",
    walletAddress:
      "addr1qr3t1y8u6i4o2p0a8s6d4f2g0h8j6k4l2z9x7c5v3b1n2jt0qpqz2z2z9zx5w4v6t0q8s9k3n7m5c4x2v8b6n4m2q9w7e5",
    baseEarned: 3120,
    baseSupporters: 204,
    verified: true,
  },
  {
    id: "ines-costa",
    handle: "inescosta",
    name: "Inês Costa",
    role: "Documentary photographer",
    initials: "IC",
    tint: "bg-accent-500",
    bio: "Long-form photo essays from West Africa, published open-access and paid for by readers.",
    category: "other",
    walletAddress:
      "addr1qw7e5r3t1y8u6i4o2p0a8s6d4f2g0h8j6k4l2z9x7c5v3b1n2jt0qpqz2z2z9zx5w4v6t0q8s9k3n7m5c4x2v8b6n4m2q9",
    baseEarned: 480,
    baseSupporters: 67,
    verified: false,
  },
];

export const DEFAULT_CREATOR_ID = "luna-dev";

export function getCreator(id: string): Creator {
  return CREATORS.find((c) => c.id === id) ?? CREATORS[0];
}
