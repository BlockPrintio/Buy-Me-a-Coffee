import { AlertCircle, ExternalLink, Loader2, Wallet } from "lucide-react";
import { useApp, type WalletId } from "../../context/AppContext";
import type { WalletName } from "../../services/cardanoWallet";
import { SITE } from "../../config/site";

export const WALLETS: {
  name: WalletName;
  label: string;
  installUrl: string;
}[] = [
  { name: "lace", label: "Lace", installUrl: "https://www.lace.io" },
  { name: "eternl", label: "Eternl", installUrl: "https://eternl.io" },
  { name: "nami", label: "Nami", installUrl: "https://namiwallet.io" },
  { name: "yoroi", label: "Yoroi", installUrl: "https://yoroi-wallet.com" },
  { name: "typhon", label: "Typhon", installUrl: "https://typhonwallet.io" },
];

export function walletLabel(id: WalletId | null): string {
  if (!id) return "";
  if (id === "demo") return "Demo wallet";
  return WALLETS.find((w) => w.name === id)?.label ?? id;
}

/**
 * The wallet chooser, shared by the log-in dialog and the checkout step so
 * both connect through the same code path.
 */
export function WalletPicker({ onConnected }: { onConnected?: () => void }) {
  const { wallet, installedWallets, connectWallet } = useApp();

  const handleConnect = async (id: WalletId) => {
    const ok = await connectWallet(id);
    if (ok) onConnected?.();
  };

  return (
    <div>
      {wallet.error && (
        <p
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {wallet.error}
        </p>
      )}

      <ul className="space-y-1.5">
        {WALLETS.map((entry) => {
          const installed = installedWallets.includes(entry.name);
          const pending = wallet.connecting === entry.name;

          if (!installed) {
            return (
              <li key={entry.name}>
                <a
                  href={entry.installUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-colors hover:bg-ink-50"
                >
                  <WalletMark name={entry.name} muted />
                  <span className="flex-1 text-sm font-semibold text-ink-400">
                    {entry.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-ink-400">
                    Install
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              </li>
            );
          }

          return (
            <li key={entry.name}>
              <button
                type="button"
                onClick={() => handleConnect(entry.name)}
                disabled={wallet.connecting !== null}
                className="flex w-full items-center gap-3 rounded-xl border border-ink-200 px-3 py-3 text-left transition-colors hover:border-brand-500 hover:bg-brand-50/60 disabled:opacity-60"
              >
                <WalletMark name={entry.name} />
                <span className="flex-1 text-sm font-semibold text-ink-900">
                  {entry.label}
                </span>
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-brand-700" />
                ) : (
                  <span className="text-xs font-semibold text-positive-500">
                    Detected
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 border-t border-ink-200 pt-5">
        <button
          type="button"
          onClick={() => handleConnect("demo")}
          disabled={wallet.connecting !== null}
          className="btn-secondary btn-sm w-full"
        >
          {wallet.connecting === "demo" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4" />
          )}
          Continue with a demo wallet
        </button>
        <p className="mt-2.5 text-xs leading-relaxed text-ink-400">
          {installedWallets.length === 0
            ? "No Cardano wallet detected in this browser. Install one above and reload, or walk the flow with the demo wallet — it holds no keys and moves no funds."
            : "The demo wallet holds no keys and moves no funds. Use it to walk the flow without touching your real balance."}{" "}
          <a
            href={SITE.external.cip30}
            target="_blank"
            rel="noreferrer noopener"
            className="font-semibold text-brand-700 underline-offset-2 hover:underline"
          >
            About CIP-30
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * Renders the wallet's own CIP-30 icon when the extension provides one,
 * falling back to a neutral glyph rather than a stand-in emoji.
 */
export function WalletMark({
  name,
  muted,
}: {
  name: WalletName;
  muted?: boolean;
}) {
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
