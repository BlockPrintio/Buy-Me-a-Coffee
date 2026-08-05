import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DEFAULT_CREATOR_ID } from "../data/creators";

const TIERS = [
  {
    name: "Basic",
    price: 5,
    description: "For fans who want to chip in each month.",
    benefits: ["Monthly support", "Email alerts", "Exclusive posts"],
    popular: false,
  },
  {
    name: "Creator",
    price: 15,
    description: "The sweet spot — most members land here.",
    benefits: [
      "Everything in Basic",
      "Priority replies",
      "Member-only Discord",
      "Early access to drops",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: 25,
    description: "For your most dedicated supporters.",
    benefits: [
      "Everything in Creator",
      "Personal shoutout",
      "Monthly podcast slot",
      "1:1 feedback session",
    ],
    popular: false,
  },
];

export function MembershipSection() {
  const { openSupport } = useApp();

  return (
    <section id="membership" className="section bg-white">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="heading-lg">
            Recurring income from your biggest fans
          </h2>
          <p className="lead mt-4">
            Set your own tiers and perks. Members renew on-chain each month —
            you keep the relationship and the revenue.
          </p>
        </motion.div>

        <div className="mt-14 grid items-start gap-6 md:grid-cols-3 lg:gap-7">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={
                tier.popular
                  ? "relative rounded-3xl bg-brand-700 p-[2px] md:-mt-4"
                  : "relative"
              }
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-700 px-3.5 py-1.5 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}

              <div
                className={`flex h-full flex-col rounded-3xl bg-white p-7 sm:p-8 ${
                  tier.popular ? "" : "border border-ink-200"
                }`}
              >
                <h3 className="font-display text-lg font-bold text-ink-900">
                  {tier.name}
                </h3>
                {/* min-height keeps the price row aligned when a description wraps */}
                <p className="mt-1.5 min-h-[2.75rem] text-sm text-ink-500">
                  {tier.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="tabular font-display text-5xl font-bold tracking-tight text-ink-900">
                    ₳{tier.price}
                  </span>
                  <span className="text-sm font-medium text-ink-500">
                    / month
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openSupport({
                      creatorId: DEFAULT_CREATOR_ID,
                      amount: tier.price,
                      recurring: true,
                      tierName: tier.name,
                    })
                  }
                  aria-haspopup="dialog"
                  className={`mt-7 w-full ${
                    tier.popular ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  Join {tier.name}
                </button>

                <div className="my-7 divider-fade" />

                <ul className="space-y-3.5">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-positive-500"
                        strokeWidth={2.5}
                      />
                      <span className="text-sm text-ink-500">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-ink-500">
          Cancel anytime · No lock-in · Members pay in ADA, you get paid in ADA
        </p>
      </div>
    </section>
  );
}
