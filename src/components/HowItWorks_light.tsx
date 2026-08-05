import { ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

const STEPS = [
  {
    title: "Claim your page",
    description:
      "Pick a handle, add a bio and a cover. No KYC, no business account, no approval queue.",
  },
  {
    title: "Connect a wallet",
    description:
      "Link Nami, Eternl, Lace, Yoroi or Typhon in one click. Support goes straight to you.",
  },
  {
    title: "Share and get paid",
    description:
      "Drop the link anywhere. Supporters send ADA in seconds and you keep custody the whole time.",
  },
];

export function HowItWorks() {
  const { openModal } = useApp();

  return (
    <section id="how-it-works" className="section bg-ink-50">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="heading-lg">Live in three steps</h2>
          <p className="lead mt-4">
            From zero to accepting on-chain support in less time than it takes
            to brew a coffee.
          </p>
        </div>

        {/* Three ruled blocks. The numeral is the sequence, set at poster
            scale so the order reads before the words do. */}
        <ol className="mt-14 grid border-3 border-ink-950 sm:mt-16 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className={`relative bg-ink-50 p-7 lg:p-8 ${
                i < STEPS.length - 1
                  ? "border-b-3 border-ink-950 md:border-b-0 md:border-r-3"
                  : ""
              }`}
            >
              <span
                aria-hidden
                className="tabular block font-display text-6xl leading-none text-brand-500"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl uppercase text-ink-950">
                {step.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-ink-500">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex">
          <button
            type="button"
            onClick={() => openModal({ kind: "start-page" })}
            aria-haspopup="dialog"
            className="btn-primary group"
          >
            Claim your handle
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-press group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
