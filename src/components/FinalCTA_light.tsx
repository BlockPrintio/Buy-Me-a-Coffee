import { ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export function FinalCTA() {
  const { openModal, page } = useApp();

  return (
    /* The close: a full scarlet plate that bleeds edge to edge, so the page
       ends on the same ink it opened with. */
    <section className="relative overflow-hidden bg-brand-500">
      <div
        aria-hidden
        className="screen-paper pointer-events-none absolute inset-0"
      />

      <div className="container-page relative py-20 sm:py-24 lg:py-28">
        <div className="max-w-4xl">
          <h2 className="lockup font-display text-5xl uppercase text-ink-50 sm:text-7xl lg:text-8xl">
            Ready to get
            <br />
            paid for
            {/* The purple plate, as in the hero. A press-black plate separates
                from the blue field at only 1.96:1, so the struck words read as
                a smudge rather than a second colour. */}
            <span className="ml-3 inline-block bg-accent-200 px-3 pb-1 pt-1.5 text-ink-950">
              your work?
            </span>
          </h2>

          <p className="mt-7 max-w-lg border-l-3 border-ink-50 pl-4 text-base font-500 leading-relaxed text-ink-50 sm:text-lg">
            Join thousands of Cardano creators earning directly from the people
            who care about what they make. Free forever, no card required.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openModal({ kind: "start-page" })}
              aria-haspopup="dialog"
              className="btn btn-lg group w-full border-ink-50 bg-ink-50 text-brand-700 shadow-plate-lg transition-all duration-150 ease-press hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none sm:w-auto"
            >
              {page ? "Open my page" : "Start my page"}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-press group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => openModal({ kind: "creators" })}
              aria-haspopup="dialog"
              className="btn btn-lg w-full border-ink-50 bg-transparent text-ink-50 transition-colors hover:bg-ink-50 hover:text-brand-500 sm:w-auto"
            >
              Browse creators
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
