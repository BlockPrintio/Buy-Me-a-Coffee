# Support Ada — product truth

Recorded from the working implementation, not aspiration. Visual decisions live
in DESIGN.md; this file only says what the thing *is*.

## What it is

A non-custodial support platform for Cardano creators. Supporters send ADA
straight from their wallet to the creator's, with an optional message. There is
no account, no card form, no custody, and no payout schedule.

## Unique mechanism

The receipt is the proof. A support transaction mints a single NFT receipt from
an Aiken minting policy that refuses to mint unless the creator was paid the
full amount **and** the platform was paid exactly its advertised fee — no more,
no less. Holding a receipt is evidence the split was honoured, because the
ledger would have rejected the transaction otherwise. No competitor claim can
be copy-pasted here: it is enforced on-chain, not promised in a footer.

## Audience and scene

Cardano-native creators — Plutus/Aiken developers, auditors, NFT artists,
educators, stake pool operators — and the supporters who already hold ADA and
already have a CIP-30 wallet installed. Read on a desktop browser with the
wallet extension one click away, or on a phone from a shared link. Daylight,
not a dark room.

## What is actually built

- **One-off support** — presets or custom amount, CIP-20 message, live fee
  breakdown, wallet connect, sign, receipt with transaction hash.
- **Memberships** — tiers that lock N months at a script address; the creator
  draws one month at a time, the supporter reclaims the rest on cancel.
  No platform fee at all on memberships.
- **Creator pages** — handle, display name, category, bio, payout wallet.
- **Creator directory** — searchable, filterable.
- **Wallet as account** — CIP-30 connect for Lace, Eternl, Nami, Yoroi,
  Typhon, plus a demo wallet that signs nothing.

## Commercial truth

- Platform fee is **2.5%**, and it is **waived entirely below ₳40** — a cut
  smaller than Cardano's min-UTxO deposit cannot exist as an output, so small
  support is genuinely free. Enforced by the validator, not by good manners.
- Cardano network fee is roughly **₳0.17**, paid to the network, not to us.
- Fees are **added on top**; the creator receives the full amount chosen.
- Minimum support is **₳1** (the min-ada deposit floor).

## Constraints

- Stack: React 18, Vite, Tailwind, framer-motion, lucide-react. No router.
- Chain: lucid-evolution + Blockfrost, Aiken PlutusV3 policy.
- Without chain config the app runs a labelled demo checkout. Every screen that
  simulates says so; that honesty is a product requirement, not a placeholder.

## Claims that must never be invented

Prices, customer counts, benchmarks, capabilities. The figures currently on the
page (10,000 creators, ₳2.5M paid, 4.9 average, per-creator totals) are
**demonstration data** and are on the user's replacement list.
