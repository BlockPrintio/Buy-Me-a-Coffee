import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, Coffee } from "lucide-react";

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
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Give your audience an easy way to say thanks
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Make supporting fun and easy. In just a couple of taps, your fans
            can send ADA and leave a message.
          </p>
        </motion.div>

        {/* Demo Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
            {/* Creator Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {creatorExample.avatar}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900">
                  {creatorExample.name}
                </h3>
                <p className="text-gray-600">{creatorExample.role}</p>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-2xl font-bold gradient-text">
                  {creatorExample.totalSupport} ₳
                </div>
                <p className="text-sm text-gray-600">
                  {creatorExample.supporterCount} supporters
                </p>
              </div>
            </div>

            {/* Amount Selector */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-4">
                Choose amount
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {amounts.map((amount) => (
                  <motion.button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-3 rounded-lg font-bold transition-all ${
                      selectedAmount === amount
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {amount}₳
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Your message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something nice..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Support Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Coffee className="w-5 h-5" />
              Send {selectedAmount} ADA to Luna Dev
            </motion.button>

            {/* Fee Info */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs text-gray-600 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-2">
                <span>
                  You send:{" "}
                  <span className="text-gray-900 font-bold">
                    {selectedAmount} ₳
                  </span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  Platform fee (2.5%):{" "}
                  <span className="text-blue-600">
                    {(selectedAmount * 0.025).toFixed(3)} ₳
                  </span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  Creator receives:{" "}
                  <span className="text-green-600 font-bold">
                    {(selectedAmount * 0.975 - 0.17).toFixed(3)} ₳
                  </span>
                </span>
              </div>
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
            <h4 className="text-sm font-bold text-gray-900 mb-4">
              Recent support
            </h4>
            {creatorExample.recentSupports.map((support, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 sm:gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all"
              >
                <Coffee className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">
                    {support.name} bought {support.amount} coffees
                  </p>
                  <p className="text-sm text-gray-600">{support.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-bold">{support.amount} ₳</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
