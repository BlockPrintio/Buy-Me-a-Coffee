import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
const tiers = [
{
  name: 'Delegator',
  price: '5',
  description: 'Perfect for casual supporters who want to stay in the loop.',
  features: [
  'Access to exclusive updates',
  'Supporter badge on profile',
  'Monthly newsletter'],

  color: 'bg-gray-100 text-gray-800',
  buttonColor: 'bg-gray-900 text-white hover:bg-gray-800'
},
{
  name: 'Patron',
  price: '25',
  description: 'For true believers who want deeper access and perks.',
  features: [
  'All Delegator perks',
  'Early access to content',
  'Private Discord role',
  'Monthly Q&A stream'],

  color: 'bg-cardano-blue text-white',
  buttonColor: 'bg-white text-cardano-blue hover:bg-gray-50',
  popular: true
},
{
  name: 'Whale',
  price: '100',
  description: 'The ultimate tier for your biggest on-chain supporters.',
  features: [
  'All Patron perks',
  '1-on-1 monthly call',
  'Exclusive NFT airdrops',
  'Name in credits'],

  color: 'bg-cardano-dark text-white',
  buttonColor: 'bg-white text-cardano-dark hover:bg-gray-100'
}];

export function MembershipSection() {
  return (
    <section className="py-24 bg-cardano-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            className="text-sm font-bold tracking-widest text-cardano-blue uppercase mb-3">
            
            Membership
          </motion.div>
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
            transition={{
              delay: 0.1
            }}
            className="text-4xl md:text-5xl font-display font-bold text-cardano-dark mb-6 leading-tight">
            
            Build a recurring income stream.
          </motion.h2>
          <motion.p
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
              delay: 0.2
            }}
            className="text-lg text-gray-600">
            
            Earn a predictable income from your most loyal fans. Set up
            membership tiers with unique perks, exclusive content, and Discord
            roles.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) =>
          <motion.div
            key={tier.name}
            initial={{
              opacity: 0,
              y: 30
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.1 + 0.3
            }}
            className={`rounded-3xl p-8 relative ${tier.color} shadow-xl ${tier.popular ? 'md:-translate-y-4' : ''}`}>
            
              {tier.popular &&
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cardano-cyan text-cardano-dark text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Most Popular
                </div>
            }
              <h3 className="text-2xl font-display font-bold mb-2">
                {tier.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">₳{tier.price}</span>
                <span className="opacity-80 text-sm">/ month</span>
              </div>
              <p className="opacity-90 mb-8 text-sm leading-relaxed h-10">
                {tier.description}
              </p>
              <button
              className={`w-full py-3 rounded-xl font-bold transition-colors mb-8 ${tier.buttonColor}`}>
              
                Join {tier.name}
              </button>
              <div className="space-y-4">
                {tier.features.map((feature, i) =>
              <div key={i} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 opacity-80 flex-shrink-0" />
                    <span className="text-sm font-medium opacity-90">
                      {feature}
                    </span>
                  </div>
              )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}