import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What wallet do I need?",
      answer:
        "You can use any CIP-30 compatible wallet including Nami, Eternl, Lace, Yoroi, or Typhon. The connection process takes just one click!",
    },
    {
      question: "How much does it cost?",
      answer:
        "Support Ada charges a 2.5% platform fee plus the network fee of 0.17 ADA. Your supporters see the full amount they're sending, so there are no hidden fees.",
    },
    {
      question: "Is my data safe on the blockchain?",
      answer:
        "Yes! All transactions happen on the Cardano blockchain with no intermediary holding your funds. We never store sensitive data - everything is non-custodial.",
    },
    {
      question: "Can I receive NFT receipts?",
      answer:
        "Yes! Premium supporters can mint an NFT receipt proving their support. This creates a permanent on-chain record.",
    },
    {
      question: "Do I need to set up a business account?",
      answer:
        "No! Support Ada is designed for creators, not businesses. Just connect your wallet and you're ready to go. No KYC required.",
    },
    {
      question: "Is this available worldwide?",
      answer:
        "Yes! Since it's built on Cardano, anyone with a wallet can support creators from anywhere in the world.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-600">
            Everything you need to know about Support Ada.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-4 sm:px-6 py-4 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between gap-3"
              >
                <span className="text-base sm:text-lg font-bold text-gray-900 text-left">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200 bg-gray-50"
                  >
                    <p className="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">
                      {faq.answer}
                    </p>
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
