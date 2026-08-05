import type { MouseEvent } from "react";
import { Github, Mail, Twitter } from "lucide-react";
import { useApp, type Modal } from "../context/AppContext";
import { SITE } from "../config/site";
import { Ada } from "./ui/Ada";
import { scrollToSection } from "../lib/utils";

/**
 * Every entry resolves to something real: an in-page section, an external
 * reference, a mail client, or a dialog. Nothing here is a placeholder `#`.
 */
type FooterLink = {
  label: string;
  href?: string;
  external?: boolean;
  modal?: NonNullable<Modal>;
};

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Memberships", href: "#membership" },
      { label: "Reviews", href: "#reviews" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      {
        label: "Cardano docs",
        href: SITE.external.cardanoDocs,
        external: true,
      },
      {
        label: "CIP-30 wallet standard",
        href: SITE.external.cip30,
        external: true,
      },
      { label: "Block explorer", href: SITE.external.explorer, external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Start a page", modal: { kind: "start-page" } },
      { label: "Browse creators", modal: { kind: "creators" } },
      { label: "Connect a wallet", modal: { kind: "wallet" } },
      { label: "Contact", href: `mailto:${SITE.email}` },
    ],
  },
];

const SOCIALS = [
  { icon: Twitter, label: "X (Twitter)", href: SITE.social.twitter },
  { icon: Github, label: "GitHub", href: SITE.social.github },
  { icon: Mail, label: "Email", href: `mailto:${SITE.email}` },
];

const LEGAL: FooterLink[] = [
  { label: "Privacy", modal: { kind: "legal", doc: "privacy" } },
  { label: "Terms", modal: { kind: "legal", doc: "terms" } },
  {
    label: "Cardano status",
    href: SITE.external.cardanoStatus,
    external: true,
  },
];

export function Footer() {
  const { openModal } = useApp();

  const renderLink = (link: FooterLink, className: string) => {
    if (link.modal) {
      return (
        <button
          key={link.label}
          type="button"
          onClick={() => openModal(link.modal!)}
          aria-haspopup="dialog"
          className={`${className} text-left`}
        >
          {link.label}
        </button>
      );
    }

    const isHash = link.href?.startsWith("#");
    return (
      <a
        key={link.label}
        href={link.href}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          if (isHash && scrollToSection(link.href!)) event.preventDefault();
        }}
        {...(link.external
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
        className={className}
      >
        {link.label}
      </a>
    );
  };

  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <a
              href="#top"
              onClick={(event) => {
                if (scrollToSection("top")) event.preventDefault();
              }}
              className="flex items-center gap-2.5"
            >
              <span className="flex h-10 w-10 items-center justify-center bg-brand-500 text-2xl text-ink-50">
                <Ada />
              </span>
              <span className="font-display text-xl uppercase tracking-[0.02em] text-ink-50">
                Support<span className="text-brand-300">·</span>Ada
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-ink-300">
              Fund your creative work on Cardano. Non-custodial support, instant
              payouts, and a community that owns the relationship.
            </p>

            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                const isMail = social.href.startsWith("mailto:");
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    {...(isMail
                      ? {}
                      : { target: "_blank", rel: "noreferrer noopener" })}
                    className="flex h-10 w-10 items-center justify-center border-3 border-ink-50 text-ink-50 transition-colors duration-150 ease-press hover:bg-brand-500"
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
                <h3 className="border-b-3 border-ink-50 pb-2 font-display text-base uppercase text-ink-50">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {renderLink(
                        link,
                        "block text-sm text-ink-300 transition-colors hover:text-ink-50",
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t-3 border-ink-50 pt-8 sm:flex-row">
          <p className="text-sm text-ink-300">
            © {new Date().getFullYear()} Support Ada. Made for Cardano creators.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {LEGAL.map((item) =>
              renderLink(
                item,
                "text-ink-300 transition-colors hover:text-ink-50",
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
