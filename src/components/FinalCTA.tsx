import React from 'react';
import { motion } from 'framer-motion';
export function FinalCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0033AD 2px, transparent 2px)',
          backgroundSize: '30px 30px'
        }}>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="text-5xl md:text-6xl font-display font-bold text-cardano-dark mb-8 leading-tight">
          
          Ready to fund your <br /> Cardano journey?
        </motion.h2>
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            delay: 0.1
          }}
          className="flex flex-col items-center gap-4">
          
          <button className="bg-cardano-blue text-white text-xl font-bold px-10 py-5 rounded-full hover:bg-blue-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            Start my page
          </button>
          <p className="text-gray-500 font-medium">
            It's free and takes less than a minute.
          </p>
        </motion.div>
      </div>
    </section>);

}