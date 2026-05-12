import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 sm:mb-6">
            Ready to fund your creative work?
          </h2>
          <p className="text-base sm:text-xl text-blue-100 mb-8 sm:mb-10">
            Join thousands of Cardano creators earning directly from their
            community.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
          >
            Start my page now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <p className="text-sm sm:text-base text-blue-100 mt-4">
            It's free and takes less than a minute!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
