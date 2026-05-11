import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBagIcon, DownloadIcon, VideoIcon } from 'lucide-react';
const products = [
{
  title: 'Aiken Smart Contract Masterclass',
  type: 'Video Course',
  price: '150',
  icon: VideoIcon,
  image: 'bg-gradient-to-br from-blue-500 to-purple-600',
  sales: 124
},
{
  title: 'Cardano Node Setup Guide (PDF)',
  type: 'E-book',
  price: '25',
  icon: DownloadIcon,
  image: 'bg-gradient-to-br from-cardano-cyan to-blue-500',
  sales: 892
},
{
  title: 'Exclusive "Genesis" NFT Drop',
  type: 'Digital Art',
  price: '500',
  icon: ShoppingBagIcon,
  image: 'bg-gradient-to-br from-orange-400 to-pink-500',
  sales: 45
}];

export function ShopSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Mock UI Grid */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.6
            }}
            className="order-2 lg:order-1 relative">
            
            <div className="grid sm:grid-cols-2 gap-6 relative z-10">
              {products.map((product, index) =>
              <motion.div
                key={index}
                whileHover={{
                  y: -5
                }}
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${index === 2 ? 'sm:col-span-2 sm:w-1/2 sm:mx-auto' : ''}`}>
                
                  <div className={`h-32 ${product.image} relative`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <product.icon className="absolute bottom-4 left-4 w-6 h-6 text-white opacity-80" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {product.type}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 line-clamp-2">
                      {product.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cardano-blue text-lg">
                        ₳{product.price}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {product.sales} sold
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            {/* Decorative background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cardano-bg rounded-full blur-3xl -z-10"></div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.6
            }}
            className="order-1 lg:order-2 max-w-lg lg:ml-auto">
            
            <div className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">
              Shop
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-cardano-dark mb-6 leading-tight">
              Sell digital products & extras.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Whether it's a 1-on-1 consultation, an e-book, or a custom NFT
              drop, you can sell it directly to your audience. No extra
              storefront required.
            </p>
            <button className="bg-white text-cardano-dark border-2 border-gray-200 font-bold text-lg px-8 py-4 rounded-full hover:border-cardano-dark transition-colors shadow-sm">
              Explore Shops
            </button>
          </motion.div>
        </div>
      </div>
    </section>);

}