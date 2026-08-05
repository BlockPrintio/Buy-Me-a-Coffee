import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Coffee, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DEFAULT_CREATOR_ID, getCreator } from "../data/creators";
import { feeBreakdown } from "../config/site";
import { formatAda, formatAdaSmart, initialsFrom, timeAgo } from "../lib/utils";

const AMOUNTS = [3, 5, 10, 25, 50, 100];
const MAX_MESSAGE = 240;

export function SupportSection() {
  const { openSupport, statsFor, supportsFor } = useApp();
  const creator = getCreator(DEFAULT_CREATOR_ID);

  const [selectedAmount, setSelectedAmount] = useState(5);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState("");

  const stats = statsFor(creator.id);
  const recent = supportsFor(creator.id).slice(0, 4);
  const fees = feeBreakdown(selectedAmount);

  const pickAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustom("");
  };

  return (
    <section id="support" className="section bg-ink-50">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="heading-lg">
            Give your audience an easy way to say thanks
          </h2>
          <p className="lead mt-4">
            A couple of taps sends ADA and a message. No sign-up wall, no card
            forms, no chargebacks.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* ---------- Support card ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="card overflow-hidden"
          >
            {/* Creator header band — solid brand blue, no cyan stop */}
            <div className="h-24 bg-brand-700" />

            {/* `relative` keeps this above the band */}
            <div className="relative px-6 pb-7 sm:px-8 sm:pb-8">
              {/* Avatar overlaps the band; the text sits safely below it */}
              <span className="-mt-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-white text-xl font-bold text-brand-700 ring-4 ring-white">
                {creator.initials}
              </span>

              <div className="mt-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-xl font-bold text-ink-900">
                    {creator.name}
                  </h3>
                  <p className="truncate text-sm text-ink-500">{creator.role}</p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <div className="tabular font-display text-2xl font-bold text-ink-900">
                    ₳{formatAda(stats.earned, 0)}
                  </div>
                  <p className="tabular text-sm text-ink-500">
                    from {stats.supporters} supporters
                  </p>
                </div>
              </div>

              {/* Amount selector */}
              <fieldset className="mt-8">
                <legend className="text-sm font-bold text-ink-900">
                  Choose an amount
                </legend>
                <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                  {AMOUNTS.map((amount) => {
                    const active = selectedAmount === amount && custom === "";
                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => pickAmount(amount)}
                        aria-pressed={active}
                        className={`tabular rounded-xl py-3 text-sm font-semibold transition-all duration-200 ease-out-expo ${
                          active
                            ? "bg-brand-700 text-white"
                            : "border border-ink-300 bg-white text-ink-700 hover:border-brand-500 hover:text-brand-700"
                        }`}
                      >
                        ₳{amount}
                      </button>
                    );
                  })}
                </div>

                <label
                  htmlFor="support-custom-amount"
                  className="mt-3 block text-sm font-medium text-ink-500"
                >
                  Or enter your own
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">
                    ₳
                  </span>
                  <input
                    id="support-custom-amount"
                    type="number"
                    min={1}
                    step={1}
                    inputMode="decimal"
                    value={custom}
                    onChange={(event) => {
                      const raw = event.target.value;
                      setCustom(raw);
                      const parsed = Number.parseFloat(raw);
                      if (Number.isFinite(parsed) && parsed > 0) {
                        setSelectedAmount(parsed);
                      }
                    }}
                    placeholder="Custom amount"
                    className="field pl-8"
                  />
                </div>
              </fieldset>

              {/* Message */}
              <div className="mt-6">
                <label
                  htmlFor="support-message"
                  className="flex items-center justify-between text-sm font-bold text-ink-900"
                >
                  Add a message
                  <span className="tabular text-xs font-medium text-ink-400">
                    {message.length}/{MAX_MESSAGE}
                  </span>
                </label>
                <textarea
                  id="support-message"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value.slice(0, MAX_MESSAGE))
                  }
                  placeholder="Say something nice…"
                  rows={3}
                  className="field mt-3 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  openSupport({
                    creatorId: creator.id,
                    amount: selectedAmount,
                    message,
                  })
                }
                disabled={selectedAmount <= 0}
                aria-haspopup="dialog"
                className="btn-primary mt-6 w-full"
              >
                <Coffee className="h-4 w-4" />
                Send ₳{formatAdaSmart(selectedAmount)} to {creator.name}
              </button>

              {/* Fee breakdown */}
              <dl className="mt-5 space-y-2.5 rounded-xl bg-ink-50 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-ink-500">You send</dt>
                  <dd className="tabular font-bold text-ink-900">
                    ₳{formatAda(selectedAmount)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-500">Platform fee (2.5%)</dt>
                  <dd className="tabular text-ink-600">
                    −₳{formatAda(fees.platformFee)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-500">Network fee</dt>
                  <dd className="tabular text-ink-600">
                    −₳{formatAda(fees.networkFee)}
                  </dd>
                </div>
                <div className="h-px bg-ink-200" />
                <div className="flex items-center justify-between">
                  <dt className="font-semibold text-ink-900">
                    {creator.name} receives
                  </dt>
                  <dd className="tabular font-bold text-positive-500">
                    ₳{formatAda(fees.creatorReceives)}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-ink-400">
                <ShieldCheck className="h-4 w-4" />
                Non-custodial — funds never touch our wallet
              </p>
            </div>
          </motion.div>

          {/* ---------- Recent support ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:sticky lg:top-28"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink-900">
                Recent support
              </h3>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-positive-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-positive-500" />
                </span>
                Live
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {recent.map((support, i) => (
                <motion.div
                  key={support.id}
                  layout
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="panel flex items-start gap-3.5 p-4"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white ${
                      TINTS[i % TINTS.length]
                    }`}
                  >
                    {initialsFrom(support.supporter)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-900">
                      {support.supporter}
                      <span className="font-medium text-ink-500">
                        {support.recurring ? " joined " : " sent "}
                      </span>
                      <span className="tabular text-brand-700">
                        ₳{formatAdaSmart(support.amount)}
                      </span>
                      <span className="ml-2 text-xs font-medium text-ink-400">
                        {timeAgo(support.ts)}
                      </span>
                    </p>
                    {support.message && (
                      <p className="mt-0.5 text-sm text-ink-500">
                        {support.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* A plain list, not another card stacked beside the cards above */}
            <ul className="mt-6 space-y-3 border-t border-ink-200 pt-6 text-sm">
              {[
                "Payouts land instantly, not in 14 days",
                "Supporters keep an on-chain receipt",
                "Works anywhere ADA does",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-positive-500" />
                  <span className="text-ink-500">{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const TINTS = [
  "bg-brand-700",
  "bg-brand-500",
  "bg-accent-600",
  "bg-ink-700",
] as const;
