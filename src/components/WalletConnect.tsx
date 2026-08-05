import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Wallet,
} from "lucide-react";
import CardanoWalletService, {
  type WalletName,
} from "../services/cardanoWallet";

const WALLETS: { name: WalletName; label: string; installUrl: string }[] = [
  { name: "nami", label: "Nami", installUrl: "https://namiwallet.io" },
  { name: "eternl", label: "Eternl", installUrl: "https://eternl.io" },
  { name: "lace", label: "Lace", installUrl: "https://www.lace.io" },
  { name: "yoroi", label: "Yoroi", installUrl: "https://yoroi-wallet.com" },
  { name: "typhon", label: "Typhon", installUrl: "https://typhonwallet.io" },
];

const STORAGE_KEY = "connectedWallet";

function truncate(value: string, lead = 8, tail = 6) {
  if (value.length <= lead + tail + 1) return value;
  return `${value.slice(0, lead)}…${value.slice(-tail)}`;
}

export function WalletConnect({ fullWidth = false }: { fullWidth?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  /** Which wallet is mid-connect — not a global flag, so only that row spins. */
  const [pending, setPending] = useState<WalletName | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<WalletName | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [installed, setInstalled] = useState<WalletName[]>([]);
  const [copied, setCopied] = useState(false);

  /** One service instance for the component's lifetime; a per-render instance
   *  would lose the connection and make disconnect a no-op. */
  const serviceRef = useRef<CardanoWalletService>();
  if (!serviceRef.current) serviceRef.current = new CardanoWalletService();

  const rootRef = useRef<HTMLDivElement>(null);

  const readWalletState = useCallback(async () => {
    const service = serviceRef.current!;
    const [addr, bal, net] = await Promise.all([
      service.getAddress(),
      service.getBalanceInADA(),
      service.getNetworkId(),
    ]);
    setAddress(addr);
    setBalance(bal);
    setNetworkId(net);
    return addr;
  }, []);

  // Detect installed wallets, and restore a previous session if it still works.
  useEffect(() => {
    setInstalled(CardanoWalletService.getAvailableWallets());

    const previous = localStorage.getItem(STORAGE_KEY) as WalletName | null;
    if (!previous) return;

    let cancelled = false;
    (async () => {
      try {
        await serviceRef.current!.connect(previous);
        if (cancelled) return;
        const addr = await readWalletState();
        if (!cancelled && addr) setConnected(previous);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [readWalletState]);

  // Close on Escape or an outside click.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  const handleConnect = async (walletName: WalletName) => {
    setPending(walletName);
    setError(null);

    try {
      await serviceRef.current!.connect(walletName);
      const addr = await readWalletState();

      if (!addr) {
        throw new Error(
          "Connected, but the wallet returned no address. Check that it is unlocked.",
        );
      }

      setConnected(walletName);
      localStorage.setItem(STORAGE_KEY, walletName);
      setIsOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not connect to that wallet.",
      );
    } finally {
      setPending(null);
    }
  };

  const handleDisconnect = () => {
    serviceRef.current!.disconnect();
    setConnected(null);
    setAddress(null);
    setBalance(null);
    setNetworkId(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    setIsOpen(false);
  };

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the address to your clipboard.");
    }
  };

  const isTestnet = networkId === 0;

  return (
    <div ref={rootRef} className={`relative ${fullWidth ? "w-full" : ""}`}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`${
          connected
            ? "btn btn-sm border border-ink-300 bg-white text-ink-800 hover:border-ink-400 hover:bg-ink-50"
            : "btn-primary btn-sm"
        } ${fullWidth ? "w-full" : ""}`}
      >
        {connected ? (
          <>
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full bg-positive-500"
            />
            <span className="tabular">{truncate(address ?? "", 6, 4)}</span>
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            Connect wallet
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Cardano wallet"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full z-50 mt-2 w-[20rem] rounded-2xl bg-white p-5 shadow-lift"
          >
            {error && (
              <p
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            {connected ? (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display font-bold text-ink-900">
                    {WALLETS.find((w) => w.name === connected)?.label ??
                      connected}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isTestnet
                        ? "bg-accent-50 text-accent-700"
                        : "bg-positive-50 text-positive-700"
                    }`}
                  >
                    {networkId === null
                      ? "Unknown network"
                      : isTestnet
                        ? "Testnet"
                        : "Mainnet"}
                  </span>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-ink-500">Balance</dt>
                    <dd className="tabular font-display text-2xl font-bold text-ink-900">
                      {balance === null ? "—" : `₳${balance.toFixed(2)}`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-500">Address</dt>
                    <dd className="mt-1 flex items-center gap-2">
                      <code className="min-w-0 flex-1 truncate rounded-lg bg-ink-50 px-2.5 py-1.5 text-xs text-ink-700">
                        {address ? truncate(address, 12, 10) : "—"}
                      </code>
                      <button
                        onClick={handleCopy}
                        aria-label="Copy wallet address"
                        className="shrink-0 rounded-lg border border-ink-300 p-2 text-ink-600 transition-colors hover:bg-ink-50"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-positive-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </dd>
                  </div>
                </dl>

                <button
                  onClick={handleDisconnect}
                  className="btn-secondary btn-sm mt-5 w-full"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-display font-bold text-ink-900">
                  Choose a wallet
                </h3>
                <p className="mt-1 text-sm text-ink-500">
                  Support lands straight in it — we never hold your keys.
                </p>

                <ul className="mt-4 space-y-1.5">
                  {WALLETS.map((wallet) => {
                    const isInstalled = installed.includes(wallet.name);
                    const isPending = pending === wallet.name;

                    if (!isInstalled) {
                      return (
                        <li key={wallet.name}>
                          <a
                            href={wallet.installUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ink-50"
                          >
                            <WalletMark name={wallet.name} muted />
                            <span className="flex-1 text-sm font-semibold text-ink-400">
                              {wallet.label}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-ink-400">
                              Install
                              <ExternalLink className="h-3 w-3" />
                            </span>
                          </a>
                        </li>
                      );
                    }

                    return (
                      <li key={wallet.name}>
                        <button
                          onClick={() => handleConnect(wallet.name)}
                          disabled={pending !== null}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ink-50 disabled:opacity-60"
                        >
                          <WalletMark name={wallet.name} />
                          <span className="flex-1 text-sm font-semibold text-ink-900">
                            {wallet.label}
                          </span>
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-brand-700" />
                          ) : (
                            <span className="text-xs font-medium text-ink-400">
                              Detected
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {installed.length === 0 && (
                  <p className="mt-4 text-xs leading-relaxed text-ink-400">
                    No Cardano wallet detected in this browser. Install one
                    above, then reload the page.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Renders the wallet's own CIP-30 icon when the extension provides one,
 * falling back to a neutral glyph rather than a stand-in emoji.
 */
function WalletMark({ name, muted }: { name: WalletName; muted?: boolean }) {
  const icon =
    typeof window !== "undefined" ? window.cardano?.[name]?.icon : undefined;

  if (icon) {
    return (
      <img
        src={icon}
        alt=""
        aria-hidden
        width={24}
        height={24}
        className={`h-6 w-6 shrink-0 rounded ${muted ? "opacity-40 grayscale" : ""}`}
      />
    );
  }

  return (
    <Wallet
      aria-hidden
      className={`h-6 w-6 shrink-0 ${muted ? "text-ink-300" : "text-ink-400"}`}
      strokeWidth={1.8}
    />
  );
}
