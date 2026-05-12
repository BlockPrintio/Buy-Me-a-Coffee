import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function MembershipSection() {
  const tiers = [
    {
      name: "Basic",
      price: 5,
      description: "Perfect for getting started",
      benefits: [
        "Support on a monthly basis",
        "Email alerts",
        "Exclusive content",
      ],
      popular: false,
    },
    {
      name: "Creator",
      price: 15,
      description: "Most popular option",
      benefits: [
        "Everything in Basic",
        "Priority support",
        "Member-only Discord",
        "Early access to features",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: 25,
      description: "For dedicated supporters",
      benefits: [
        "Everything in Creator",
        "Personal shoutout",
        "Monthly podcast slot",
        "1:1 feedback session",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start a membership for your biggest fans
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Earn recurring income by accepting monthly or yearly subscriptions
            with exclusive perks.
          </p>
        </motion.div>

        {/* Membership Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 sm:p-8 rounded-2xl transition-all ${
                tier.popular
                  ? "bg-white border-2 border-blue-600 shadow-lg md:scale-105"
                  : "bg-white border border-gray-200 hover:shadow-md"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {tier.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${tier.price}
                </span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-lg font-bold mb-8 transition-all ${
                  tier.popular
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Join
              </motion.button>

              <div className="space-y-3">
                {tier.benefits.map((benefit, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
