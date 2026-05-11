import React from 'react';
import { motion } from 'framer-motion';
const stats = [
{
  value: '50K+',
  label: 'Creators'
},
{
  value: '₳12M+',
  label: 'Tipped'
},
{
  value: '180+',
  label: 'Countries'
},
{
  value: '100%',
  label: 'On-chain optional'
}];

export function StatsSection() {
  return (
    <section className="py-16 bg-cardano-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
          {stats.map((stat, index) =>
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
            className={
            index % 2 !== 0 ?
            'border-l border-white/20 md:border-l-0' :
            'border-l-0'
            }>
            
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-blue-200 font-medium text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}