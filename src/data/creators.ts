import { CHAIN } from "../config/chain";

/**
 * The seeded creator directory. One source of truth for the support card, the
 * testimonials and the "Browse creators" list, so a support sent from any of
 * them lands on the same profile.
 *
 * The payout addresses are real, valid **preprod** addresses derived from the
 * public test mnemonic documented in the README — so support sent to them on
 * preprod genuinely settles, and the testnet ADA stays recoverable rather than
 * being burned at an address nobody holds the key to. They are fixtures, not
 * anyone's real wallet: point `CREATORS` at real addresses before running this
 * on mainnet.
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
      "addr_test1qryvgass5dsrf2kxl3vgfz76uhp83kv5lagzcp29tcana68ca5aqa6swlq6llfamln09tal7n5kvt4275ckwedpt4v7q48uhex",
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
      "addr_test1qpqy3lufef8c3en9nrnzp2svwy5vy9zangvp46dy4qw23clgfxhn3pqv243d6wptud7fuaj5tjqer7wc7m036gx0emsqaqa8te",
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
      "addr_test1qr9xuxclxgx4gw3y4h4tcz4yvfmrt3e5nd3elphhf00a67xnrv5vjcv6tzehj2nnjj4cth4ndzyuf4asvvkgzeac2hfqk0za93",
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
      "addr_test1qqra0q073cecs03hr724psh3ppejrlpjuphgpdj7xjwvkqnhqttgsr5xuaaq2g805dldu3gq9gw7gwmgdyhpwkm59ensgyph06",
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
      "addr_test1qp38kfvcm4c39yt8sfgkp3tyqe736fz708xzxuy5s9w9ev43yh3sash5eeq9ngrfuzxrekpvmly52xlmyfy8lz39emhs2spswl",
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
      "addr_test1qrrv7774puml0exvzc0uqrc8axezy6a925kv4ucdx906qy6mhjxtmx44x70ndr7g6dgqcdaf69q8fnrdmtvfud5x7rsqvsuqx5",
    baseEarned: 480,
    baseSupporters: 67,
    verified: false,
  },
];

export const DEFAULT_CREATOR_ID = "luna-dev";

export function getCreator(id: string): Creator {
  return CREATORS.find((c) => c.id === id) ?? CREATORS[0];
}

/**
 * Whether an address can actually receive an on-chain payment on the network
 * this build is configured for.
 *
 * The network half matters as much as the shape: a mainnet-configured site
 * handed a preprod fixture address would otherwise get as far as building a
 * transaction before failing deep inside the serialisation layer. Catching it
 * here lets the checkout say so plainly and fall back to a demo receipt.
 *
 * This is a shape check, not a checksum — full validation happens in the
 * transaction builder, which has the bech32 decoder.
 */
export function isPayableAddress(address: string): boolean {
  const wantsTestnet = CHAIN.network !== "Mainnet";
  const prefix = wantsTestnet ? "addr_test1" : "addr1";

  if (!address.startsWith(prefix)) return false;
  // Mainnet's `addr1` is a prefix of nothing else, but `addr_test1` addresses
  // must not be accepted as mainnet ones.
  if (!wantsTestnet && address.startsWith("addr_test1")) return false;
  if (
    !/^[023456789acdefghjklmnpqrstuvwxyz]+$/.test(address.slice(prefix.length))
  ) {
    return false;
  }
  return address.length - prefix.length >= 50;
}
