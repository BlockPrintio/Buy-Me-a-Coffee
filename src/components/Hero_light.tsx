import { useState } from "react";
import { ArrowRight, Check, Coffee } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Ada, AdaText } from "./ui/Ada";
import { DEFAULT_CREATOR_ID, getCreator } from "../data/creators";
import { FEE_THRESHOLD_ADA } from "../config/chain";
import {
  formatAda,
  formatAdaSmart,
  scrollToSection,
  timeAgo,
} from "../lib/utils";

/** One coffee is ₳5, so the ticket's total tracks the cup count. */
const COFFEE_PRICE = 5;
const COFFEE_COUNTS = [1, 3, 5];

const AVATARS = [
  { initials: "LD", tint: "bg-ink-950" },
  { initials: "PR", tint: "bg-brand-500" },
  { initials: "SJ", tint: "bg-accent-500" },
  { initials: "MK", tint: "bg-ink-700" },
];

export function Hero() {
  const { openModal, openSupport, statsFor, supportsFor } = useApp();
  const creator = getCreator(DEFAULT_CREATOR_ID);
  const [cups, setCups] = useState(3);

  const amount = cups * COFFEE_PRICE;
  const stats = statsFor(creator.id);
  const latest = supportsFor(creator.id)[0];

  return (
    <section id="top" className="relative overflow-hidden bg-brand-500">
      {/* The scarlet plate, screened where it meets the fold. */}
      <div
        aria-hidden
        className="screen-paper pointer-events-none absolute inset-0"
      />

      <div className="container-page relative pb-16 pt-14 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          {/* ---------- The lockup ---------- */}
          <div>
            <h1
              style={{ animationDelay: "0ms" }}
              className="animate-ink-in lockup font-display text-6xl uppercase text-ink-50 sm:text-8xl lg:text-9xl"
            >
              <span className="block">Fund</span>
              <span className="block">your work,</span>
              {/* Two words struck on the black plate instead of the paper one */}
              <span className="-ml-1 mt-1.5 inline-block bg-accent-200 px-3 pb-1.5 pt-2 text-ink-950 sm:mt-2 sm:px-4">
                paid in ada
              </span>
            </h1>

            <p
              style={{ animationDelay: "70ms" }}
              className="animate-ink-in mt-7 max-w-lg border-l-3 border-ink-50 pl-4 text-base font-500 leading-relaxed text-ink-50 sm:text-lg"
            >
              Accept ADA support, launch a membership, and open a shop, with
              funds landing straight in your wallet. No middleman, no custody,
              no waiting.
            </p>

            <div
              style={{ animationDelay: "140ms" }}
              className="animate-ink-in mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <button
                type="button"
                onClick={() => openModal({ kind: "start-page" })}
                aria-haspopup="dialog"
                className="btn-lg group border-ink-50 bg-ink-50 text-brand-700 shadow-plate-lg btn w-full transition-all duration-150 ease-press hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none sm:w-auto"
              >
                Start my page
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-press group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="btn btn-lg w-full border-ink-50 bg-transparent text-ink-50 hover:bg-ink-50 hover:text-brand-700 sm:w-auto"
              >
                See how it works
              </button>
            </div>

            {/* Proof, set as a printed footnote rather than a stat rack. */}
            <div
              style={{ animationDelay: "210ms" }}
              className="animate-ink-in mt-10 border-t-3 border-ink-50 pt-5"
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <button
                  type="button"
                  onClick={() => openModal({ kind: "creators" })}
                  aria-label="Browse creators"
                  aria-haspopup="dialog"
                  className="flex -space-x-1 transition-transform duration-150 ease-press hover:-translate-y-0.5"
                >
                  {AVATARS.map((a) => (
                    <span
                      key={a.initials}
                      className={`flex h-9 w-9 items-center justify-center border-3 border-ink-50 text-[0.65rem] font-800 text-ink-50 ${a.tint}`}
                    >
                      {a.initials}
                    </span>
                  ))}
                </button>
                {/* A benefit rather than a traction number, and true at every
                    amount: fees are added on top of a support instead of taken
                    out of it, so the creator is always paid the full figure.
                    The threshold is read from config so the promise cannot
                    drift away from what the checkout actually charges. */}
                <p className="max-w-sm text-sm font-500 leading-snug text-ink-50">
                  <span className="font-800 text-ink-50">
                    Creators keep 100%.
                  </span>{" "}
                  Support under <Ada />{FEE_THRESHOLD_ADA} is free, and every ADA
                  lands straight in their wallet.
                </p>
              </div>
            </div>
          </div>

          {/* ---------- The support ticket ---------- */}
          <div
            style={{ animationDelay: "180ms" }}
            className="animate-ink-in relative mx-auto w-full max-w-md lg:mt-3 lg:max-w-none"
          >
            <div className="border-3 border-ink-950 bg-ink-50 shadow-plate-lg">
              {/* Docket header — the ticket says what it is */}
              <div className="flex items-center justify-between gap-3 border-b-3 border-ink-950 bg-ink-950 px-4 py-2.5">
                <span className="docket font-700 text-ink-50">
                  Support ticket
                </span>
                <span className="docket text-ink-50">No. 001</span>
              </div>

              <div className="p-5 sm:p-6">
                {/* Creator row */}
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center border-3 border-ink-950 text-sm font-800 text-ink-50 ${creator.tint}`}
                  >
                    {creator.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-800 uppercase tracking-[0.02em] text-ink-950">
                      <span className="truncate">{creator.name}</span>
                      <span
                        title="Verified creator"
                        className="inline-flex h-4 w-4 shrink-0 items-center justify-center bg-positive-500 text-ink-50"
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={4} />
                      </span>
                    </p>
                    <p className="truncate text-sm text-ink-400">
                      {creator.role}
                    </p>
                  </div>
                </div>

                <div className="my-5 divider-fade" />

                <fieldset>
                  <legend className="label">
                    Buy {creator.name.split(" ")[0]} a coffee
                  </legend>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex h-11 w-11 items-center justify-center border-3 border-ink-950 bg-accent-500 text-ink-50">
                      <Coffee className="h-5 w-5" />
                    </span>
                    <span className="font-display text-lg text-ink-500">×</span>
                    {COFFEE_COUNTS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCups(n)}
                        aria-pressed={cups === n}
                        aria-label={`${n} ${n === 1 ? "coffee" : "coffees"} for ₳${n * COFFEE_PRICE}`}
                        className={`tabular flex h-11 w-11 items-center justify-center border-3 border-ink-950 font-sans text-sm font-800 transition-colors duration-150 ${
                          cups === n
                            ? "bg-brand-500 text-ink-50"
                            : "bg-ink-50 text-ink-950 hover:bg-ink-100"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        openSupport({ creatorId: creator.id, amount: 30 })
                      }
                      aria-label="Choose your own amount"
                      className="flex h-11 w-11 items-center justify-center border-3 border-dashed border-ink-950 font-sans text-sm font-800 text-ink-400 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-950"
                    >
                      5+
                    </button>
                  </div>
                </fieldset>

                <p className="mt-5 border-l-3 border-brand-500 bg-ink-100 px-4 py-3 text-sm italic text-ink-600">
                  “Your Aiken tutorials saved my launch. Thank you!”
                </p>

                <button
                  type="button"
                  onClick={() =>
                    openSupport({
                      creatorId: creator.id,
                      amount,
                      message:
                        "Your Aiken tutorials saved my launch. Thank you!",
                    })
                  }
                  aria-haspopup="dialog"
                  className="btn-primary mt-5 w-full"
                >
                  Support <Ada />
                  {amount}
                </button>

                <p className="docket mt-3 text-center text-ink-400">
                  On-chain · Non-custodial · No account
                </p>
              </div>

              {/* Ledger strip: the two live figures, printed as a footer band */}
              <dl className="grid grid-cols-2 border-t-3 border-ink-950">
                <div className="border-r-3 border-ink-950 px-4 py-3">
                  <dt className="label">Raised</dt>
                  <dd className="tabular flex items-center gap-0.5 font-display text-2xl text-ink-950">
                    <Ada />
                    {formatAda(stats.earned, 0)}
                  </dd>
                </div>
                <div className="px-4 py-3">
                  <dt className="label">Supporters</dt>
                  <dd className="tabular font-display text-2xl text-ink-950">
                    {stats.supporters}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Latest support, struck out of register against the ticket */}
            <div
              style={{ animationDelay: "320ms" }}
              className="animate-ink-in skew-plate absolute -bottom-11 left-6 z-10 hidden items-center gap-2.5 border-3 border-ink-950 bg-accent-500 px-3.5 py-2 shadow-plate-sm sm:flex"
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink-50 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ink-50" />
              </span>
              <p className="text-xs font-800 uppercase tracking-[0.06em] text-ink-50">
                <AdaText>
                  {latest
                    ? `${latest.supporter} sent ₳${formatAdaSmart(latest.amount)}`
                    : "Alex sent ₳25"}
                </AdaText>
                <span className="ml-2 font-500 opacity-80">
                  {latest ? timeAgo(latest.ts) : "just now"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The fold: a hard diagonal where the scarlet plate ends. */}
      <div aria-hidden className="cut-up -mb-px h-14 bg-ink-50 sm:h-20" />
    </section>
  );
}
