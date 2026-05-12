import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Do I need a Cardano wallet to receive funds?",
    a: "Yes! You'll need a Cardano wallet address to receive your ADA. We support all major wallets including Lace, Eternl, Nami, and Yoroi. Connection takes 30 seconds.",
  },
  {
    q: "Are there any fees?",
    a: "Support Ada charges a flat 2.5% platform fee. Standard Cardano network fees (~0.17 ADA) apply. No hidden fees, 100% transparent.",
  },
  {
    q: "Is Support Ada non-custodial?",
    a: "Yes! Transactions go directly from supporters to your wallet via smart contract. We never hold your funds. Your keys, your coins.",
  },
  {
    q: "Can I mint NFT receipts for supporters?",
    a: "Absolutely. Supporters can opt-in to receive a unique NFT receipt minted on Cardano as proof of their support. Great for building community.",
  },
  {
    q: "What if I want to offer membership tiers?",
    a: "Create custom tiers with benefits. Supporters subscribe and receive exclusive content, early access, or special perks you define.",
  },
  {
    q: "Is this available worldwide?",
    a: "Yes! If you have a Cardano wallet and internet, you can use Support Ada. No geographic restrictions.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-24 bg-gradient-to-b from-[#1a1f3a] to-[#0A1428] relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Got Questions?
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Frequently Asked</span>
            <br />
            <span className="text-gray-300">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg bg-purple-500/10 border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition-colors"
            >
              <button
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-white text-lg">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-purple-500/20">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
