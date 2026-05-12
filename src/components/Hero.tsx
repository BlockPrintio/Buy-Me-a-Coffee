import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#0A1428] via-[#1a1f3a] to-[#0A1428] overflow-hidden flex items-center py-20">
      {/* Animated background blobs */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full filter blur-3xl opacity-50"
      />
      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl opacity-50"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Trust Badge */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-8">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Zap key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-300 font-medium">Trusted by 50K+ Cardano Creators</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Fund Your Cardano</span>
            <br />
            <span className="text-gray-100">Dreams & Projects</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Accept native ADA support. Create membership tiers. Launch a shop. All without intermediaries.
          </motion.p>

          {/* Feature Pills */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {[
              { icon: '⚡', text: 'Instant Settlements' },
              { icon: '🔐', text: 'Secure & Decentralized' },
              { icon: '📈', text: 'Grow Your Audience' },
            ].map((item, i) => (
              <div key={i} className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-full hover:border-purple-500/60 transition-colors">
                <span className="text-2xl mr-2">{item.icon}</span>
                <span className="text-gray-300 font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Creating
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-purple-500/50 text-gray-300 font-bold rounded-lg hover:bg-purple-500/10 transition-all"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-16 border-t border-purple-500/20">
            {[
              { stat: '10K+', label: 'Creators' },
              { stat: '₳2.5M+', label: 'Distributed' },
              { stat: '100K+', label: 'Supporters' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-bold gradient-text">{item.stat}</div>
                <div className="text-sm text-gray-400 mt-2">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
