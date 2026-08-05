import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Ada } from "./ui/Ada";
import { walletLabel } from "./wallet/WalletPicker";
import { scrollToSection, truncateMiddle } from "../lib/utils";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Membership", href: "#membership" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openModal, isConnected, wallet, page } = useApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intercept the in-page anchors so the sticky header doesn't swallow the
  // target, while the URL still ends up with a shareable hash.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (scrollToSection(href)) event.preventDefault();
    setIsOpen(false);
  };

  const walletChip = isConnected
    ? truncateMiddle(wallet.address ?? "", 6, 4)
    : null;

  return (
    <header
      className={`sticky top-0 z-50 bg-ink-950 transition-shadow duration-200 ease-press ${
        scrolled ? "shadow-plate-sm" : ""
      }`}
    >
      <div className="container-page">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#top"
            onClick={(event) => goTo(event, "#top")}
            className="group flex min-w-0 items-center gap-2.5 text-ink-50"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center bg-brand-500 text-xl text-ink-50 transition-transform duration-200 ease-press group-hover:-rotate-6">
              <Ada />
            </span>
            <span className="truncate font-display text-xl uppercase tracking-[0.02em] text-ink-50">
              Support<span className="text-brand-300">·</span>Ada
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => goTo(event, item.href)}
                className="px-3.5 py-2 text-xs font-800 uppercase tracking-[0.1em] text-ink-200 transition-colors duration-150 hover:bg-brand-500 hover:text-ink-50"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => openModal({ kind: "wallet" })}
              aria-haspopup="dialog"
              className={
                walletChip
                  ? "btn btn-sm border-ink-50 bg-transparent text-ink-50 hover:bg-ink-50 hover:text-ink-950"
                  : "px-4 py-2.5 text-xs font-800 uppercase tracking-[0.1em] text-ink-200 transition-colors hover:text-brand-400"
              }
            >
              {walletChip ? (
                <>
                  <span
                    aria-hidden
                    className="h-2 w-2 shrink-0 rounded-full bg-positive-500"
                  />
                  <span className="tabular">{walletChip}</span>
                  <span className="sr-only">
                    {walletLabel(wallet.id)} connected. Open wallet details
                  </span>
                </>
              ) : (
                "Log in"
              )}
            </button>
            <button
              type="button"
              onClick={() => openModal({ kind: "start-page" })}
              aria-haspopup="dialog"
              className="btn-primary btn-sm"
            >
              {" "}
              {page ? "My page" : "Start my page"}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="border-3 border-ink-50 p-1.5 text-ink-50 transition-colors hover:bg-brand-500 lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t-3 border-ink-50 bg-ink-950 lg:hidden"
          >
            <div className="container-page space-y-1 py-4">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => goTo(event, item.href)}
                  className="block border-b-3 border-ink-800 px-3 py-3 text-sm font-800 uppercase tracking-[0.1em] text-ink-200 transition-colors hover:bg-brand-500 hover:text-ink-50"
                >
                  {item.label}
                </a>
              ))}
              <div className="grid gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openModal({ kind: "wallet" });
                  }}
                  className="btn btn-sm w-full border-ink-50 bg-transparent text-ink-50 hover:bg-ink-50 hover:text-ink-950"
                >
                  {" "}
                  {walletChip ? `Wallet · ${walletChip}` : "Log in"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openModal({ kind: "start-page" });
                  }}
                  className="btn-primary btn-sm w-full border-ink-50 shadow-none"
                >
                  {" "}
                  {page ? "My page" : "Start my page"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
