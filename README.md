# Support Ada

Buy Me a Coffee for the Cardano ecosystem. Supporters send ADA straight to a
creator's wallet and get an on-chain receipt for it; nothing is ever held in
custody by the platform.

```text
.
├── contracts/          Aiken validators, tests and the compiled blueprint
│   ├── validators/support.ak          receipt minting policy (one-off support)
│   ├── validators/support.test.ak     27 tests, mostly attacks
│   ├── validators/membership.ak       prepaid subscription script
│   ├── validators/membership.test.ak  17 tests, both directions
│   └── plutus.json                    build output (checked in)
└── src/                React front end
    ├── contracts/plutus.json       copy the app imports
    ├── services/supportTx.ts       one-off support: pay + mint receipt
    ├── services/membershipTx.ts    memberships: start, claim, cancel
    └── config/chain.ts             network + fee configuration
```

## What the contract actually does

A tip on Cardano is just a payment, so a validator is not needed to move the
ADA. What it *is* needed for is proof. `support.receipt` is a minting policy
that issues one receipt token, and it refuses to mint unless the same
transaction:

- pays the creator the full amount named in the redeemer,
- pays the platform whatever fee is genuinely due,
- mints exactly one token — not two, not a quantity of five.

So a receipt in a supporter's wallet is self-evidencing: the ledger would have
rejected the transaction if the split had not been honoured. The funds
themselves never touch a script address, which is what keeps the flow
non-custodial and instant.

The platform address, the fee rate and the waiver threshold are applied as
compile-time parameters, so a deployed policy id commits to one specific set of
terms. Changing any of them yields a different policy id, and receipts already
minted stay verifiable under the terms they were minted with. The validator
also refuses outright to operate above a 10% rate, whatever it is configured
with.

### The fee has a floor, and it is not a design choice

Cardano will not create an output holding less than the min-UTxO deposit
(~0.86 ADA). A 2.5% cut of a 5 ADA coffee is 0.125 ADA — not merely small,
but *impossible to pay as an output*. The fee only becomes payable once the
support is around 40 ADA.

Rather than inflate small tips up to the deposit, the fee is waived below the
threshold: coffee-sized support costs nothing extra and the creator keeps every
lovelace. `fee_due` in the validator and `feeDueLovelace` in
`src/config/chain.ts` implement the identical rule, so the checkout screen and
the chain can never disagree.

## Memberships

There is no scheduler on a blockchain, so a "monthly membership" cannot be a
charge that fires by itself. `membership` models what it honestly can be: a
prepaid balance the creator draws down one period at a time.

A supporter locks N months up front with the terms in the datum. The creator
may take exactly one month's worth once that month falls due, and the remainder
returns to the same script with the claim date moved forward. The supporter can
stop at any time and reclaim what has not been earned.

Neither side can surprise the other:

- The creator cannot claim early, cannot take two periods at once, and cannot
  keep the remainder out of the script or quietly rewrite the terms on the way
  through.
- The supporter cannot cancel out from under a period already earned. To
  reclaim the whole balance the transaction must carry an upper bound proving
  it runs *before* the next claim date; without that proof the creator is paid
  that period first.

Claiming and cancelling are implemented alongside starting, in
`src/services/membershipTx.ts` — shipping the lock without the unlocks would
strand people's ADA. Memberships carry no platform fee in this build.

## Running it

```bash
npm install
npm run dev
```

With no configuration the app runs in **demo mode**: wallet connection,
balances and network reads are genuine CIP-30 calls, but the support itself is
simulated and every screen that shows a receipt says so.

### Going on-chain

```bash
cp .env.example .env.local
```

Fill in `VITE_BLOCKFROST_PROJECT_ID` (free from [blockfrost.io](https://blockfrost.io))
and `VITE_PLATFORM_ADDRESS`, both for the same network. Start on `Preprod` —
testnet ADA is free from the
[faucet](https://docs.cardano.org/cardano-testnets/tools/faucet). Demo mode
switches itself off as soon as both are present.

Two things still gate a real send, by design:

- **The wallet's network must match.** A preprod-configured site refuses to
  build a transaction for a mainnet wallet rather than let you sign it.
- **The creator needs a payout address on the configured network.** The seeded
  profiles in `src/data/creators.ts` carry real **preprod** addresses derived
  from the public test mnemonic below, so support to them genuinely settles on
  preprod and the testnet ADA stays recoverable rather than being burned at an
  address nobody holds. They are fixtures: replace them before running on
  mainnet, or connect a wallet and claim a page, which stores your own address.

  ```text
  test test test test test test test test test test test test
  test test test test test test test test test test test sauce
  ```

  This mnemonic is published in Cardano tooling everywhere and is worthless by
  design. Never send mainnet funds to an address derived from it.

## Working on the contract

```bash
npm run contracts:check   # aiken check — runs the test suite
npm run contracts:build   # aiken build — regenerates plutus.json and copies it into src/
```

Install the toolchain with [aikup](https://aiken-lang.org/installation-instructions)
(`aikup install`); this was built against Aiken v1.1.23 and stdlib v3.1.0.

The tests are mostly adversarial — skipping the creator, shortchanging them,
paying their share to someone else, understating the amount to dodge the fee,
minting two receipts at once, disguising a mint as a burn. Run them before
touching the policy.

Because the parameters change the policy id, you can check that the front end
and the compiler agree:

```bash
aiken blueprint apply -m support -v receipt <platform-credential-cbor>
```

should produce the same policy id that `receiptPolicyId()` returns in
`src/services/supportTx.ts`.

## Notes

- The Cardano serialisation stack is ~2.6 MB of WebAssembly. It sits behind a
  dynamic import in the checkout, so it never loads on the landing page.
- Messages ride along as CIP-20 transaction metadata (label 674), split into
  64-byte lines rather than truncated.
- Memberships are prepaid rather than auto-renewing, for the reason above. A
  supporter who wants to keep going past the funded months starts another
  membership; nothing can debit their wallet without a signature.
- The membership script identifies both parties by public-key hash, so
  script-based (smart-contract) wallets cannot hold one on either side yet.
  One-off support has no such limit — it works for script creators too.
