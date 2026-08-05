import { motion } from "framer-motion";
import { Coffee, Star } from "lucide-react";
import { useApp } from "../context/AppContext";

const TESTIMONIALS = [
  {
    creatorId: "luna-dev",
    name: "Luna Dev",
    role: "Plutus smart contract developer",
    initials: "LD",
    tint: "bg-brand-700",
    message:
      "Support Ada made it trivial to get direct funding from my community. No intermediaries, just on-chain transactions that land in seconds.",
    metric: "₳4.2K earned",
  },
  {
    creatorId: "pete-rivera",
    name: "Pete Rivera",
    role: "Smart contract auditor",
    initials: "PR",
    tint: "bg-brand-500",
    message:
      "The Cardano integration is seamless. My supporters love that funds go straight to my wallet with zero custody risk on anyone's part.",
    metric: "318 supporters",
  },
  {
    creatorId: "sarah-johnson",
    name: "Sarah Johnson",
    role: "NFT artist",
    initials: "SJ",
    tint: "bg-accent-600",
    message:
      "Membership tiers plus NFT receipts turned casual followers into a real community. It feels like my own platform, not someone else's.",
    metric: "92 members",
  },
];

export function Testimonials() {
  const { openSupport, openModal } = useApp();

  return (
    <section id="reviews" className="section bg-white">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="heading-lg">Loved by Cardano creators</h2>
          <div className="mt-5 flex items-center gap-2.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-accent-400 text-accent-400"
                />
              ))}
            </div>
            <p className="text-sm font-medium text-ink-500">
              4.9 average from 1,200+ creators
            </p>
          </div>
          <button
            type="button"
            onClick={() => openModal({ kind: "creators" })}
            aria-haspopup="dialog"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition-colors hover:text-brand-800"
          >
            Browse every creator →
          </button>
        </motion.div>

        <div className="mt-14 grid gap-x-12 gap-y-10 border-t border-ink-200 pt-12 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.figure
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="flex flex-col"
            >
              <blockquote className="flex-1 font-display text-lg leading-relaxed text-ink-800">
                “{testimonial.message}”
              </blockquote>

              <figcaption className="mt-6 flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white ${testimonial.tint}`}
                >
                  {testimonial.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-900">
                    {testimonial.name}
                  </p>
                  {/* Wraps rather than truncating — the metric must stay readable */}
                  <p className="text-sm text-ink-500">
                    {testimonial.role} · {testimonial.metric}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    openSupport({
                      creatorId: testimonial.creatorId,
                      amount: 5,
                    })
                  }
                  aria-label={`Support ${testimonial.name}`}
                  aria-haspopup="dialog"
                  className="shrink-0 rounded-lg border border-ink-300 p-2.5 text-ink-600 transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  <Coffee className="h-4 w-4" />
                </button>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
