import React from "react";
import { motion } from "framer-motion";
import { Bell, Shield, TrendingUp, Users, Wallet, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant payouts",
    description:
      "Support settles to your wallet in seconds — no payout schedule, no holds, no minimum threshold before you can touch your own money.",
  },
  {
    icon: Wallet,
    title: "Any CIP-30 wallet",
    description:
      "Nami, Eternl, Lace, Yoroi and Typhon all connect in a single click, and you keep your keys throughout.",
  },
  {
    icon: Shield,
    title: "On-chain receipts",
    description:
      "Supporters can mint an NFT receipt — permanent, verifiable proof that they backed you early.",
  },
  {
    icon: Users,
    title: "Community tiers",
    description:
      "Build membership levels with real perks and turn one-off tips into income you can plan around.",
  },
  {
    icon: Bell,
    title: "Real-time alerts",
    description:
      "Get notified the moment someone supports you, with their message attached.",
  },
  {
    icon: TrendingUp,
    title: "Analytics that matter",
    description:
      "Earnings, top supporters and growth trends, without leaving your dashboard.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section bg-ink-50">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="heading-lg">Built for creators, not for businesses</h2>
          <p className="lead mt-4">
            Everything you need to fund creative work on Cardano — and nothing
            you don't.
          </p>
        </motion.div>

        {/* A divided list, not a rack of identical cards */}
        <div className="mt-14 border-t border-ink-200">
          <div className="grid md:grid-cols-2 md:gap-x-14">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                  className="flex gap-5 border-b border-ink-200 py-8"
                >
                  <Icon
                    className="mt-0.5 h-6 w-6 shrink-0 text-brand-700"
                    strokeWidth={1.8}
                  />
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-ink-500">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
