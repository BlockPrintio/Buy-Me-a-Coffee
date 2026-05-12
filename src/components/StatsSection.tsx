import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Active Creators", icon: "👥" },
  { value: "₳2.5M+", label: "Distributed", icon: "💰" },
  { value: "100K+", label: "Supporters", icon: "❤️" },
  { value: "100%", label: "Non-Custodial", icon: "🔐" },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-y border-purple-500/20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full filter blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                className="text-4xl md:text-5xl mb-3"
              >
                {stat.icon}
              </motion.div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 font-medium text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
