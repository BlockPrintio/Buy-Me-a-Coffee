import { Coffee } from "lucide-react";
import { useApp } from "../context/AppContext";
import { AdaText } from "./ui/Ada";

const TESTIMONIALS = [
  {
    creatorId: "luna-dev",
    name: "Luna Dev",
    role: "Plutus smart contract developer",
    initials: "LD",
    tint: "bg-brand-500",
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
    <section id="reviews" className="section bg-ink-50">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="heading-lg">Loved by Cardano creators</h2>
          {/* No rating here: there is no rated population yet, and inventing
              one is the same lie as inventing a payout total. What is true is
              how the payment behaves, so that is what the strapline states. */}
          <p className="mt-5 max-w-xl text-sm font-500 text-ink-500">
            Every support settles straight to the creator's own wallet, and the
            receipt it mints is proof they were paid in full.
          </p>
          <button
            type="button"
            onClick={() => openModal({ kind: "creators" })}
            aria-haspopup="dialog"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-800 text-brand-500 transition-colors hover:text-brand-600"
          >
            Browse every creator →
          </button>
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-10 border-t-3 border-ink-950 pt-12 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure key={testimonial.name} className="flex flex-col">
              <blockquote className="flex-1 text-lg font-500 leading-snug text-ink-950">
                “{testimonial.message}”
              </blockquote>

              <figcaption className="mt-6 flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center  text-sm font-700 text-ink-50 ${testimonial.tint}`}
                >
                  {testimonial.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg uppercase text-ink-950">
                    {testimonial.name}
                  </p>
                  {/* Wraps rather than truncating — the metric must stay readable */}
                  <p className="text-sm text-ink-500">
                    {testimonial.role} · <AdaText>{testimonial.metric}</AdaText>
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
                  className="shrink-0 border-3 border-ink-950 p-2.5 text-ink-950 transition-colors hover:bg-brand-500 hover:text-ink-50"
                >
                  <Coffee className="h-4 w-4" />
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
