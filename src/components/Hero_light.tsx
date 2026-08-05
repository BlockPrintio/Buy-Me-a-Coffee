import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Coffee, Heart } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DEFAULT_CREATOR_ID, getCreator } from "../data/creators";
import {
  formatAda,
  formatAdaSmart,
  scrollToSection,
  timeAgo,
} from "../lib/utils";

/** One coffee is ₳5, so the preview card's total tracks the cup count. */
const COFFEE_PRICE = 5;
const COFFEE_COUNTS = [1, 3, 5];

const AVATARS = [
  { initials: "LD", tint: "bg-brand-700" },
  { initials: "PR", tint: "bg-brand-500" },
  { initials: "SJ", tint: "bg-accent-600" },
  { initials: "MK", tint: "bg-ink-700" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const { openModal, openSupport, statsFor, supportsFor } = useApp();
  const creator = getCreator(DEFAULT_CREATOR_ID);
  const [cups, setCups] = useState(3);

  const amount = cups * COFFEE_PRICE;
  const stats = statsFor(creator.id);
  const latest = supportsFor(creator.id)[0];

  return (
    <section
      id="top"
      className="relative pb-20 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24"
    >
      {/* A single soft wash off the top-left, not a field of blobs. Bounded to
          the section's own width, so the section needs no overflow clip that
          would trap the floating cards. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-gradient-to-br from-brand-50 via-white to-white"
      />

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* ---------- Copy ---------- */}
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="heading-xl lg:text-[4.25rem]"
            >
              Fund your work,{" "}
              <span className="relative inline-block text-brand-700">
                paid in ADA
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-accent-400"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8C60 3 120 2 180 4c40 1.3 78 3.3 118 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="lead mx-auto mt-6 max-w-xl lg:mx-0 lg:text-xl"
            >
              Accept ADA support, launch a membership, and open a shop — with
              funds landing straight in your wallet. No middleman, no custody,
              no waiting.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <button
                type="button"
                onClick={() => openModal({ kind: "start-page" })}
                aria-haspopup="dialog"
                className="btn-primary btn-lg group w-full sm:w-auto"
              >
                Start my page
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="btn-secondary btn-lg w-full sm:w-auto"
              >
                See how it works
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 lg:justify-start"
            >
              <button
                type="button"
                onClick={() => openModal({ kind: "creators" })}
                aria-label="Browse creators"
                aria-haspopup="dialog"
                className="flex -space-x-1.5 rounded-full transition-transform duration-200 ease-out-expo hover:-translate-y-0.5"
              >
                {AVATARS.map((a) => (
                  <span
                    key={a.initials}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white ${a.tint}`}
                  >
                    {a.initials}
                  </span>
                ))}
              </button>
              {/* The proof reads as a sentence rather than a stat rack */}
              <p className="max-w-sm text-left text-sm leading-relaxed text-ink-500">
                <span className="font-semibold text-ink-900">
                  10,000 creators
                </span>{" "}
                have been paid{" "}
                <span className="font-semibold text-ink-900">₳2.5M</span>, each
                transfer settling in under three seconds.
              </p>
            </motion.div>
          </motion.div>

          {/* ---------- Product preview ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="card p-6 sm:p-7">
              {/* Creator row */}
              <div className="flex items-center gap-3.5">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold text-white ${creator.tint}`}
                >
                  {creator.initials}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-semibold text-ink-900">
                    <span className="truncate">{creator.name}</span>
                    <span
                      title="Verified creator"
                      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-positive-500 text-white"
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={4} />
                    </span>
                  </p>
                  <p className="truncate text-sm text-ink-500">
                    {creator.role}
                  </p>
                </div>
              </div>

              <div className="my-6 divider-fade" />

              <fieldset className="mt-0">
                <legend className="text-sm font-semibold text-ink-800">
                  Buy {creator.name.split(" ")[0]} a coffee
                </legend>
                <div className="mt-3 flex items-center gap-2.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <Coffee className="h-5 w-5" />
                  </span>
                  <span className="text-ink-300">×</span>
                  {COFFEE_COUNTS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCups(n)}
                      aria-pressed={cups === n}
                      aria-label={`${n} ${n === 1 ? "coffee" : "coffees"} — ₳${n * COFFEE_PRICE}`}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 ease-out-expo ${
                        cups === n
                          ? "bg-brand-700 text-white"
                          : "border border-ink-200 text-ink-600 hover:border-brand-500 hover:text-brand-700"
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
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-ink-300 text-sm font-semibold text-ink-400 transition-colors hover:border-brand-500 hover:text-brand-700"
                  >
                    5+
                  </button>
                </div>
              </fieldset>

              <p className="mt-5 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-500">
                “Your Aiken tutorials saved my launch. Thank you!”
              </p>

              <button
                type="button"
                onClick={() =>
                  openSupport({
                    creatorId: creator.id,
                    amount,
                    message: "Your Aiken tutorials saved my launch. Thank you!",
                  })
                }
                aria-haspopup="dialog"
                className="btn-primary mt-5 w-full"
              >
                Support ₳{amount}
              </button>

              <p className="mt-3 text-center text-xs text-ink-400">
                Settles on-chain · Non-custodial · No account needed
              </p>
            </div>

            {/* Floating notification — opaque, so it stays legible over anything */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute -bottom-10 -left-3 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lift sm:flex lg:-left-10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                <Heart className="h-4 w-4 fill-current" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight text-ink-900">
                  {latest
                    ? `${latest.supporter} sent ₳${formatAdaSmart(latest.amount)}`
                    : "Alex sent ₳25"}
                </p>
                <p className="text-xs text-ink-500">
                  {latest ? timeAgo(latest.ts) : "just now"} · on-chain
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="absolute -right-2 -top-6 hidden rounded-2xl bg-white px-4 py-3 shadow-lift sm:block lg:-right-7"
            >
              <p className="text-xs font-medium text-ink-500">Raised so far</p>
              <p className="tabular font-display text-xl font-bold text-ink-900">
                ₳{formatAda(stats.earned, 0)}
              </p>
              <p className="tabular text-xs font-semibold text-positive-500">
                {stats.supporters} supporters
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
