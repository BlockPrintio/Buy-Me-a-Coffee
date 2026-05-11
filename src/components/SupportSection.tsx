import React from 'react';
import { motion } from 'framer-motion';
export function SupportSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: -30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true,
              margin: '-100px'
            }}
            transition={{
              duration: 0.6
            }}
            className="max-w-lg">
            
            <div className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">
              Support
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-cardano-dark mb-6 leading-tight">
              Give your audience an easy way to say thanks.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Buy me an ₳DA makes supporting fun and easy. In just a couple of
              taps, your fans can make the payment (buy you an ADA) and leave a
              message. They don't even have to create an account!
            </p>
            <ul className="space-y-4">
              {[
              'Connect any Cardano wallet instantly',
              'Receive 100% of tips directly on-chain',
              'Supporters can leave public or private messages'].
              map((item, i) =>
              <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-cardano-cyan/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-cardano-cyan"></div>
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              )}
            </ul>
          </motion.div>

          {/* Mock UI */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true,
              margin: '-100px'
            }}
            transition={{
              duration: 0.6,
              delay: 0.2
            }}
            className="relative">
            
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 max-w-md mx-auto relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  CC
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    Buy CardanoCrypto an ₳DA
                  </h3>
                  <p className="text-sm text-gray-500">3,240 delegators</p>
                </div>
              </div>

              <div className="bg-cardano-bg rounded-2xl p-6 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cardano-blue text-white flex items-center justify-center font-display font-bold text-lg">
                      ₳
                    </div>
                    <span className="font-bold text-gray-400 text-xl">x</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 3, 5].map((num) =>
                    <button
                      key={num}
                      className={`w-12 h-12 rounded-full font-bold text-lg transition-colors ${num === 3 ? 'bg-cardano-blue text-white shadow-md' : 'bg-white text-cardano-blue border border-blue-100 hover:bg-blue-50'}`}>
                      
                        {num}
                      </button>
                    )}
                    <button className="w-12 h-12 rounded-full bg-white text-gray-400 border border-gray-200 font-medium text-sm hover:bg-gray-50">
                      Custom
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm font-medium text-gray-500">
                  Total:{' '}
                  <span className="text-gray-900 font-bold text-lg">15 ₳</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Name or @twitter (optional)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cardano-blue/20 focus:border-cardano-blue outline-none transition-all" />
                
                <textarea
                  placeholder="Say something nice... (optional)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cardano-blue/20 focus:border-cardano-blue outline-none transition-all resize-none">
                </textarea>
              </div>

              <button className="w-full bg-cardano-blue text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-800 transition-colors">
                Support 15 ₳
              </button>
            </div>

            {/* Decorative background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-cardano-blue/5 to-cardano-cyan/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>);

}