import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          className="rounded-4xl bg-brand-800 px-6 py-16 sm:px-12 sm:py-20"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to get paid for your work?
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-brand-100 sm:text-lg">
              Join thousands of Cardano creators earning directly from the
              people who care about what they make. Free forever, no card
              required.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button className="btn-on-dark btn-lg group w-full sm:w-auto">
                Start my page
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
              </button>
              <button className="btn btn-lg w-full border border-white/40 text-white transition hover:bg-white/10 sm:w-auto">
                Browse creators
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
