import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Luna Dev",
      role: "Plutus Smart Contract Developer",
      avatar: "🎯",
      message:
        "Support Ada made it so easy to get direct funding from my community. No intermediaries, just pure on-chain transactions!",
      stars: 5,
    },
    {
      name: "Pete Rivera",
      role: "Smart Contract Auditor",
      avatar: "⚙️",
      message:
        "The Cardano integration is seamless. My supporters love that their funds go directly to my wallet with zero custody risk.",
      stars: 5,
    },
    {
      name: "Sarah Johnson",
      role: "NFT Artist",
      avatar: "🎨",
      message:
        "I love how I can create different membership tiers and even mint NFT receipts. It's like having a personal Cardano platform.",
      stars: 5,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Cardano creators
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Real stories from real creators using Support Ada.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 hover:shadow-md transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.stars)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Message */}
              <p className="text-gray-700 mb-6 italic">
                &quot;{testimonial.message}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
