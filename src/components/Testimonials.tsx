import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Support Ada changed everything. My delegators love how easy it is to tip directly from their wallets, and I don't lose fees to middlemen anymore.",
    name: "Alex Chen",
    role: "Stake Pool Operator",
    avatar: "🎯",
  },
  {
    quote:
      "I sell my Aiken smart contract templates here. Getting paid in native ADA feels right and the on-chain receipts add credibility.",
    name: "Pete Rivera",
    role: "Smart Contract Developer",
    avatar: "⚙️",
  },
  {
    quote:
      "My community can support my generative art instantly. The membership tiers let them subscribe with ADA and get exclusive access.",
    name: "Sarah Johnson",
    role: "NFT Artist",
    avatar: "🎨",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-b from-[#0A1428] via-[#1a1f3a] to-[#0A1428] relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Loved by Creators</span>
            <br />
            <span className="text-gray-300">Trusted by the Community</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join thousands of Cardano creators earning ADA on their own terms
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-8 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/60 transition-all group flex flex-col h-full"
            >
              <div className="flex-grow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-purple-400 text-purple-400"
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-8 font-medium">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
