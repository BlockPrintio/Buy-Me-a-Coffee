import React from "react";
import { motion } from "framer-motion";
import { Zap, Wallet, Shield, Users, Bell, TrendingUp } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Get paid instantly to your Cardano wallet",
    },
    {
      icon: Wallet,
      title: "Multi-Wallet Support",
      description: "Connect Nami, Eternl, Lace, and more",
    },
    {
      icon: Shield,
      title: "On-Chain Receipts",
      description: "Supporters get NFT proof of support",
    },
    {
      icon: Users,
      title: "Community Tiers",
      description: "Create membership levels for recurring income",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Never miss a new supporter or message",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track your earnings and growth",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Designed for creators,
            <span className="block">not for businesses</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to fund your creative work on the Cardano
            blockchain.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 sm:p-8 bg-gray-50 border border-gray-200 rounded-xl hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
