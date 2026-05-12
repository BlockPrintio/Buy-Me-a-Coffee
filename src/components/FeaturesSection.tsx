import React from "react";
import { motion } from "framer-motion";
import { Wallet, Coins, Shield, Users, Zap, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Coins,
    title: "Native ADA Payouts",
    description:
      "Receive pure ADA directly to your wallet instantly. No fiat conversions, no intermediaries.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Wallet,
    title: "Multi-Wallet Support",
    description:
      "Connect Lace, Eternl, Nami, Yoroi, Typhon, and more with one click.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "On-Chain Receipts",
    description:
      "Supporters mint NFT proof-of-support receipts directly on Cardano.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Community Tiers",
    description:
      "Create membership levels with exclusive perks for your supporters.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description: "Get real-time alerts when supporters send ADA to your page.",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description:
      "Track earnings, supporters, and growth with detailed insights.",
    gradient: "from-indigo-500 to-purple-500",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-b from-[#0A1428] to-[#1a1f3a] relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Built for Cardano</span>
            <br />
            <span className="text-gray-300">Creator Economy</span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Every feature is designed with Cardano principles in mind:
            decentralized, secure, and creator-first.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Gradient border */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              />

              {/* Card */}
              <div className="relative p-8 rounded-xl bg-purple-500/10 border border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300 h-full">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
