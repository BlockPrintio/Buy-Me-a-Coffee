import { Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Ada } from "./ui/Ada";
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
    description: "The sweet spot, where most members land.",
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
    <section id="membership" className="section bg-ink-50">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="heading-lg">
            Recurring income from your biggest fans
          </h2>
          <p className="lead mt-4">
            Set your own tiers and perks. Members renew on-chain each month, and
            you keep the relationship and the revenue.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 md:grid-cols-3 lg:gap-7">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={tier.popular ? "relative md:-mt-5" : "relative"}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-6 z-10 whitespace-nowrap border-3 border-ink-950 bg-ink-950 px-2.5 py-1 text-[0.625rem] font-800 uppercase tracking-[0.14em] text-ink-50">
                  Most popular
                </span>
              )}

              <div
                className={`flex h-full flex-col border-3 border-ink-950 p-7 sm:p-8 ${
                  tier.popular
                    ? "bg-brand-500 text-ink-50 shadow-plate"
                    : "bg-ink-50"
                }`}
              >
                <h3
                  className={`font-display text-3xl uppercase ${
                    tier.popular ? "text-ink-50" : "text-ink-950"
                  }`}
                >
                  {tier.name}
                </h3>
                {/* min-height keeps the price row aligned when a description wraps */}
                <p
                  className={`mt-1.5 min-h-[2.75rem] text-sm ${
                    tier.popular ? "text-ink-100" : "text-ink-500"
                  }`}
                >
                  {tier.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span
                    className={`tabular flex items-center font-display text-6xl ${
                      tier.popular ? "text-ink-50" : "text-ink-950"
                    }`}
                  >
                    <Ada />
                    {tier.price}
                  </span>
                  <span
                    className={`text-sm font-700 uppercase tracking-[0.08em] ${
                      tier.popular ? "text-ink-100" : "text-ink-400"
                    }`}
                  >
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
                    tier.popular
                      ? "btn border-ink-950 bg-ink-950 text-ink-50 shadow-plate-paper hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                      : "btn-secondary"
                  }`}
                >
                  Join {tier.name}
                </button>

                <div className="my-7 divider-fade" />

                <ul className="space-y-3.5">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          tier.popular ? "text-ink-50" : "text-positive-500"
                        }`}
                        strokeWidth={2.5}
                      />
                      <span
                        className={`text-sm ${
                          tier.popular ? "text-ink-100" : "text-ink-500"
                        }`}
                      >
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-ink-500">
          Cancel anytime · No lock-in · Members pay in ADA, you get paid in ADA
        </p>
      </div>
    </section>
  );
}
