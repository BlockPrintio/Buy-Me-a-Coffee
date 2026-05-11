import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
const faqs = [
{
  q: 'Do I need a Cardano wallet to receive funds?',
  a: "Yes! You'll need a Cardano wallet address to receive your ADA. We support all major wallets including Lace, Eternl, Nami, and Yoroi."
},
{
  q: 'Are there any fees?',
  a: 'We charge a flat 5% platform fee on transactions to keep the servers running. Standard Cardano network transaction fees (usually ~0.17 ADA) also apply.'
},
{
  q: 'Is Buy me an ADA custodial?',
  a: 'No. We never hold your funds. When a supporter buys you an ADA, the transaction goes directly from their wallet to yours via a smart contract.'
},
{
  q: 'Can SPOs use this for delegator rewards?',
  a: 'Absolutely. We have built-in tools that allow you to verify if a supporter is currently delegating to your pool, allowing you to offer exclusive perks or content.'
},
{
  q: 'Do my supporters need a wallet to tip me?',
  a: 'While having a Cardano wallet is the easiest way for them to tip, we also provide fiat on-ramps so non-crypto natives can support you with a credit card (which is automatically converted to ADA for you).'
}];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 bg-cardano-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-cardano-dark mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) =>
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            
              <button
              className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              
                <span className="font-bold text-gray-900 text-lg">{faq.q}</span>
                <ChevronDownIcon
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              
              </button>
              <AnimatePresence>
                {openIndex === index &&
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0
                }}
                animate={{
                  height: 'auto',
                  opacity: 1
                }}
                exit={{
                  height: 0,
                  opacity: 0
                }}
                transition={{
                  duration: 0.3
                }}>
                
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
              }
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>);

}