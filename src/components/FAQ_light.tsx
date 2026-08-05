import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    question: "What wallet do I need?",
    answer:
      "Any CIP-30 compatible wallet works — Nami, Eternl, Lace, Yoroi or Typhon. Connecting takes one click and you never hand over your keys.",
  },
  {
    question: "How much does it cost?",
    answer:
      "A 2.5% platform fee plus the Cardano network fee of roughly 0.17 ADA. Supporters always see the full breakdown before they confirm, so there are no surprises.",
  },
  {
    question: "Is my data safe on the blockchain?",
    answer:
      "Every transaction settles directly on Cardano with no intermediary holding funds. We store no sensitive data — the whole flow is non-custodial by design.",
  },
  {
    question: "Can supporters get NFT receipts?",
    answer:
      "Yes. Supporters can mint an NFT receipt as permanent, verifiable proof of their support — a nice collectible and a nice record for you both.",
  },
  {
    question: "Do I need a business account?",
    answer:
      "No. Support Ada is built for creators, not companies. Connect a wallet and your page is live. No KYC, no paperwork, no approval queue.",
  },
  {
    question: "Is this available worldwide?",
    answer:
      "Anywhere ADA works, Support Ada works. Because it runs on Cardano, supporters can back you from any country without a bank in the middle.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section bg-ink-50">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center lg:sticky lg:top-28 lg:self-start lg:text-left"
          >
            <h2 className="heading-lg">Questions, answered</h2>
            <p className="lead mt-4">
              Everything worth knowing before you spin up your page.
            </p>
            <a
              href="#top"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition-colors hover:text-brand-800"
            >
              Still stuck? Talk to us →
            </a>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-300 ease-out-expo ${
                    isOpen ? "border-brand-500" : "border-ink-200 hover:border-ink-300"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span
                      className={`font-display text-base font-bold transition-colors sm:text-lg ${
                        isOpen ? "text-brand-800" : "text-ink-900"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out-expo ${
                        isOpen
                          ? "rotate-45 bg-brand-700 text-white"
                          : "bg-ink-100 text-ink-600"
                      }`}
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-[0.95rem] leading-relaxed text-ink-500 sm:px-6">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
