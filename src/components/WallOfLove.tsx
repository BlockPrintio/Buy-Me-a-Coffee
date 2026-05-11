import React from 'react';
const tips = [
{
  name: 'Alex',
  action: 'bought CardanoCrypto 5 ₳',
  time: '2 mins ago'
},
{
  name: 'Sam',
  action: "joined PlutusPete's membership",
  time: '15 mins ago'
},
{
  name: 'Anonymous',
  action: 'bought ADAArtCollective 20 ₳',
  time: '1 hour ago'
},
{
  name: 'David',
  action: 'bought Catalyst Compass 10 ₳',
  time: '2 hours ago'
},
{
  name: 'Elena',
  action: 'bought an E-book from PlutusPete',
  time: '3 hours ago'
},
{
  name: 'Marcus',
  action: 'bought StakeWithPride 5 ₳',
  time: '5 hours ago'
},
{
  name: 'Sarah',
  action: 'bought Cardano Daily 15 ₳',
  time: '6 hours ago'
}];

export function WallOfLove() {
  // Duplicate for seamless infinite scroll
  const marqueeItems = [...tips, ...tips, ...tips];
  return (
    <section
      id="wall-of-love"
      className="py-16 bg-white border-y border-gray-100 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h2 className="text-2xl font-display font-bold text-cardano-dark">
          Recent Activity
        </h2>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6 py-4">
          {marqueeItems.map((tip, index) =>
          <div
            key={index}
            className="inline-flex items-center gap-4 bg-cardano-bg px-6 py-4 rounded-2xl border border-gray-100 shadow-sm min-w-max">
            
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cardano-blue to-cardano-cyan text-white flex items-center justify-center font-bold">
                {tip.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-bold">{tip.name}</span> {tip.action}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{tip.time}</p>
              </div>
            </div>
          )}
        </div>
        {/* Second marquee for seamless looping */}
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6 py-4 absolute top-0">
          {marqueeItems.map((tip, index) =>
          <div
            key={`dup-${index}`}
            className="inline-flex items-center gap-4 bg-cardano-bg px-6 py-4 rounded-2xl border border-gray-100 shadow-sm min-w-max">
            
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cardano-blue to-cardano-cyan text-white flex items-center justify-center font-bold">
                {tip.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-bold">{tip.name}</span> {tip.action}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{tip.time}</p>
              </div>
            </div>
          )}
        </div>

        {/* Gradient fades for edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </section>);

}