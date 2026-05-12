import React from "react";
import { motion } from "framer-motion";
import { Coffee, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-white pt-20 pb-14 sm:pt-24 sm:pb-16 md:pt-32 md:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-block mb-5 sm:mb-6 px-3 sm:px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
            <span className="text-xs sm:text-sm font-semibold text-blue-700">
              ✨ Loved by 50K+ Cardano creators
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-6 text-gray-900 leading-tight">
            Fund Your Cardano
            <br />
            <span className="gradient-text">Creative Work</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-1">
            Accept ADA support. Start a membership. Setup a shop. It's easier
            than you think.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Start my page
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition-all"
            >
              Learn more
            </motion.button>
          </div>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            It's free and takes less than a minute!
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto mt-14 sm:mt-20 pt-10 sm:pt-12 border-t border-gray-200"
        >
          {[
            { stat: "10K+", label: "Creators" },
            { stat: "₳2.5M+", label: "Distributed" },
            { stat: "100K+", label: "Supporters" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                {item.stat}
              </div>
              <div className="text-sm text-gray-600 mt-2">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
