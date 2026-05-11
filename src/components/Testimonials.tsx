import React from 'react';
import { motion } from 'framer-motion';
const testimonials = [
{
  quote:
  "Switching to Buy me an ADA changed everything. My delegators love how easy it is to tip directly from Eternl, and I don't lose 10% to fiat payment processors anymore.",
  name: 'Alex @CardanoCrypto',
  role: 'Stake Pool Operator',
  initials: 'CC',
  color: 'bg-blue-500'
},
{
  quote:
  'I use the Shop feature to sell my Aiken smart contract templates. The integration is flawless and getting paid in native ADA feels so right for a Cardano dev.',
  name: 'Pete @PlutusPete',
  role: 'Smart Contract Developer',
  initials: 'PP',
  color: 'bg-cardano-cyan'
},
{
  quote:
  'My community wanted a way to support my art between NFT drops. The membership tiers let them subscribe with ADA, and I can reward them with exclusive airdrops.',
  name: 'Sarah @ADAArtCollective',
  role: 'Generative NFT Artist',
  initials: 'AC',
  color: 'bg-purple-500'
}];

export function Testimonials() {
  return (
    <section className="py-24 bg-cardano-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-cardano-dark mb-4">
            Loved by builders, SPOs & artists
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of creators earning ADA on their own terms.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) =>
          <motion.div
            key={i}
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
              delay: i * 0.15
            }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
            
              <div className="flex-grow">
                <div className="text-cardano-cyan mb-4">
                  {[...Array(5)].map((_, i) =>
                <span key={i} className="text-xl">
                      ★
                    </span>
                )}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-8 font-medium">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <div
                className={`w-12 h-12 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-lg`}>
                
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}