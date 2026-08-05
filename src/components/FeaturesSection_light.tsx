import { Bell, Shield, TrendingUp, Users, Wallet, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant payouts",
    description:
      "Support settles to your wallet in seconds: no payout schedule, no holds, no minimum threshold before you can touch your own money.",
  },
  {
    icon: Wallet,
    title: "Any CIP-30 wallet",
    description:
      "Nami, Eternl, Lace, Yoroi and Typhon all connect in a single click, and you keep your keys throughout.",
  },
  {
    icon: Shield,
    title: "On-chain receipts",
    description:
      "Supporters can mint an NFT receipt: permanent, verifiable proof that they backed you early.",
  },
  {
    icon: Users,
    title: "Community tiers",
    description:
      "Build membership levels with real perks and turn one-off tips into income you can plan around.",
  },
  {
    icon: Bell,
    title: "Real-time alerts",
    description:
      "Get notified the moment someone supports you, with their message attached.",
  },
  {
    icon: TrendingUp,
    title: "Analytics that matter",
    description:
      "Earnings, top supporters and growth trends, without leaving your dashboard.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section bg-ink-100">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="heading-lg">Built for creators, not for businesses</h2>
          <p className="lead mt-4">
            Everything you need to fund creative work on Cardano, and nothing
            you don't.
          </p>
        </div>

        {/* A divided list, not a rack of identical cards */}
        <div className="mt-14 border-t-3 border-ink-950">
          <div className="grid md:grid-cols-2 md:gap-x-14">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex gap-5 border-b-3 border-ink-950 py-8"
                >
                  <Icon
                    className="mt-1 h-6 w-6 shrink-0 text-brand-500"
                    strokeWidth={1.8}
                  />
                  <div>
                    <h3 className="font-display text-xl uppercase text-ink-950">
                      {feature.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-ink-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
