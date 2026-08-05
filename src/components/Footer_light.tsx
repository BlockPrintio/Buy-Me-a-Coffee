import React from "react";
import { Github, Mail, Twitter } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Memberships", "Pricing", "Reviews"],
  },
  {
    title: "Resources",
    links: ["Help center", "Blog", "Cardano docs", "API reference"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press kit", "Contact"],
  },
];

const SOCIALS = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-lg font-bold text-white">
                ₳
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Support<span className="text-accent-300">Ada</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-300">
              Fund your creative work on Cardano. Non-custodial support,
              instant payouts, and a community that owns the relationship.
            </p>

            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-ink-200 transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-transparent hover:bg-brand-700 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="font-display text-sm font-bold text-white">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-ink-300 transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-ink-300">
            © {new Date().getFullYear()} Support Ada. Made for Cardano creators.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {["Privacy", "Terms", "Status"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-ink-300 transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
