import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowRight, Send } from "lucide-react";

export function SupportSection() {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [message, setMessage] = useState("");
  const amounts = [3, 5, 10, 25, 50, 100];

  const creatorExample = {
    name: "Luna Dev",
    role: "Plutus Smart Contract Developer",
    avatar: "LD",
    totalSupport: 250,
    supporterCount: 42,
    recentSupports: [
      { name: "Alex", amount: 10, message: "Love your Aiken tutorials!" },
      { name: "Jamie", amount: 5, message: "Keep up the amazing work!" },
      {
        name: "Taylor",
        amount: 25,
        message: "Your documentation saved us hours",
      },
    ],
  };

  return (
    <section
      id="support"
      className="py-24 bg-gradient-to-b from-[#1a1f3a] to-[#0A1428] relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Support Creators</span>
            <br />
            <span className="text-gray-300">Send ADA in Seconds</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            See how easy it is to support your favorite Cardano creators with
            instant ADA transactions.
          </p>
        </motion.div>

        {/* Demo Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/50 rounded-2xl p-8">
            {/* Creator Header */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-purple-500/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {creatorExample.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  {creatorExample.name}
                </h3>
                <p className="text-gray-400">{creatorExample.role}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold gradient-text">
                  {creatorExample.totalSupport} ₳
                </div>
                <p className="text-sm text-gray-400">
                  {creatorExample.supporterCount} supporters
                </p>
              </div>
            </div>

            {/* Support Amount Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-4">
                Choose Amount
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                {amounts.map((amount) => (
                  <motion.button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-3 rounded-lg font-bold transition-all ${
                      selectedAmount === amount
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/50"
                        : "bg-purple-500/20 text-gray-300 border border-purple-500/30 hover:border-purple-500/60"
                    }`}
                  >
                    {amount}₳
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something nice..."
                className="w-full px-4 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition-colors resize-none"
                rows={3}
              />
            </div>

            {/* Support Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50"
            >
              <Heart className="w-5 h-5" />
              Send {selectedAmount} ADA to Luna Dev
              <Send className="w-5 h-5" />
            </motion.button>

            {/* Fee Info */}
            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-xs text-gray-400">
                You send:{" "}
                <span className="text-white font-bold">{selectedAmount} ₳</span>{" "}
                • Platform fee (2.5%):{" "}
                <span className="text-purple-400">
                  {(selectedAmount * 0.025).toFixed(3)} ₳
                </span>{" "}
                • Creator receives:{" "}
                <span className="text-green-400 font-bold">
                  {(selectedAmount * 0.975 - 0.17).toFixed(3)} ₳
                </span>
              </p>
            </div>
          </div>

          {/* Recent Supports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-3"
          >
            <h4 className="text-sm font-semibold text-gray-400 mb-4">
              Recent Supports
            </h4>
            {creatorExample.recentSupports.map((support, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:border-purple-500/60 transition-colors"
              >
                <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-semibold">{support.name}</p>
                  <p className="text-sm text-gray-400">{support.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-300 font-bold">
                    {support.amount} ₳
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
