import React from 'react';
import { motion } from 'framer-motion';
import {
  WalletIcon,
  CoinsIcon,
  ShieldCheckIcon,
  UsersIcon,
  ZapIcon } from
'lucide-react';
const features = [
{
  icon: CoinsIcon,
  title: 'Native ADA Payouts',
  description:
  'No fiat conversions. Receive pure ADA directly to your wallet instantly.'
},
{
  icon: WalletIcon,
  title: 'Connect Any Wallet',
  description:
  'Seamless integration with Lace, Eternl, Nami, Yoroi, and Typhon.'
},
{
  icon: ShieldCheckIcon,
  title: 'Optional On-chain Receipts',
  description:
  'Supporters can mint a proof-of-support NFT receipt directly on Cardano.'
},
{
  icon: UsersIcon,
  title: 'Stake Pool Integration',
  description:
  'SPOs can verify delegators and offer exclusive perks to their pool members.'
},
{
  icon: ZapIcon,
  title: 'Project Catalyst Friendly',
  description:
  'Perfect for proposers to gather community backing before or after voting.'
}];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-display font-bold text-cardano-dark mb-4">
            Built for the Cardano ecosystem
          </h2>
          <p className="text-lg text-gray-600">
            We designed every feature with the Cardano community in mind. No
            compromises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) =>
          <motion.div
            key={index}
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
              delay: index * 0.1
            }}
            className="p-8 rounded-3xl bg-cardano-bg border border-gray-100 hover:shadow-md transition-shadow">
            
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-cardano-blue">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}