import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, HeartIcon } from 'lucide-react';
const floatingCards = [
{
  id: 1,
  name: 'CardanoCrypto',
  role: 'is running a stake pool [TICKER]',
  supporters: '3,240 delegators',
  initials: 'CC',
  color: 'bg-blue-500',
  position: 'top-20 -left-12 lg:-left-24',
  rotation: -6,
  delay: 0
},
{
  id: 2,
  name: 'PlutusPete',
  role: 'is teaching Aiken smart contracts',
  supporters: '1,892 supporters',
  initials: 'PP',
  color: 'bg-cardano-cyan',
  position: 'top-64 -left-4 lg:-left-12',
  rotation: 4,
  delay: 1.2
},
{
  id: 3,
  name: 'ADAArtCollective',
  role: 'is minting generative NFTs',
  supporters: '5,107 supporters',
  initials: 'AC',
  color: 'bg-purple-500',
  position: 'bottom-10 -left-16 lg:-left-32',
  rotation: -3,
  delay: 0.5
},
{
  id: 4,
  name: 'StakeWithPride',
  role: 'is running a community pool',
  supporters: '2,415 delegators',
  initials: 'SP',
  color: 'bg-orange-500',
  position: 'top-16 -right-12 lg:-right-24',
  rotation: 5,
  delay: 0.8
},
{
  id: 5,
  name: 'Cardano Daily',
  role: 'is a podcast on the ecosystem',
  supporters: '980 supporters',
  initials: 'CD',
  color: 'bg-green-500',
  position: 'top-60 -right-4 lg:-right-8',
  rotation: -4,
  delay: 1.5
},
{
  id: 6,
  name: 'Catalyst Compass',
  role: 'helps proposers win funding',
  supporters: '1,330 supporters',
  initials: 'CC',
  color: 'bg-pink-500',
  position: 'bottom-16 -right-16 lg:-right-32',
  rotation: 6,
  delay: 0.3
}];

export function Hero() {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0033AD 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}
            className="flex items-center justify-center gap-1 mb-6 text-cardano-dark/80 font-medium">
            
            <div className="flex text-cardano-blue">
              {[...Array(5)].map((_, i) =>
              <StarIcon key={i} className="w-5 h-5 fill-current" />
              )}
            </div>
            <span className="ml-2">Loved by 50,000+ Cardano creators</span>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.1
            }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight text-cardano-dark mb-6 leading-[1.1]">
            
            Fund your <br className="hidden md:block" />
            Cardano journey
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            
            Accept support. Start a membership. Setup a shop. It's easier than
            you think.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.3
            }}
            className="flex flex-col items-center gap-4">
            
            <button className="bg-cardano-blue text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Start my page
            </button>
            <p className="text-sm text-gray-500 font-medium">
              It's free and takes less than a minute!
            </p>
          </motion.div>
        </div>

        {/* Floating Cards - Desktop Only */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full max-w-6xl mx-auto">
            {floatingCards.map((card) =>
            <motion.div
              key={card.id}
              className={`absolute ${card.position} bg-white p-4 rounded-2xl shadow-xl border border-gray-100 w-56 flex flex-col items-center text-center`}
              initial={{
                opacity: 0,
                scale: 0.8,
                rotate: card.rotation
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -15, 0],
                rotate: [card.rotation, card.rotation + 2, card.rotation]
              }}
              transition={{
                opacity: {
                  duration: 0.8,
                  delay: card.delay
                },
                scale: {
                  duration: 0.8,
                  delay: card.delay,
                  type: 'spring'
                },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: card.delay
                },
                rotate: {
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: card.delay
                }
              }}>
              
                <div
                className={`w-12 h-12 rounded-full ${card.color} text-white flex items-center justify-center font-bold text-lg mb-3 shadow-inner`}>
                
                  {card.initials}
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1 leading-tight">
                  {card.name}{' '}
                  <span className="font-normal text-gray-600">{card.role}</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-2">
                  <HeartIcon className="w-3 h-3 text-gray-400" />
                  {card.supporters}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

}