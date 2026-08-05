import React from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    title: "Claim your page",
    description:
      "Pick a handle, add a bio and a cover. No KYC, no business account, no approval queue.",
  },
  {
    title: "Connect a wallet",
    description:
      "Link Nami, Eternl, Lace, Yoroi or Typhon in one click. Support goes straight to you.",
  },
  {
    title: "Share and get paid",
    description:
      "Drop the link anywhere. Supporters send ADA in seconds and you keep custody the whole time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section bg-white">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="heading-lg">Live in three steps</h2>
          <p className="lead mt-4">
            From zero to accepting on-chain support in less time than it takes
            to brew a coffee.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-ink-200 sm:mt-16 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="bg-white p-7 lg:p-8"
            >
              {/* The number is the sequence itself, so it carries its weight */}
              <span className="tabular font-display text-sm font-bold text-brand-700">
                Step {i + 1}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-ink-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
