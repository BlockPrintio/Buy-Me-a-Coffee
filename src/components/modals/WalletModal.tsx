import { useState } from "react";
import { Check, Copy, LogOut } from "lucide-react";
import { Modal } from "../ui/Modal";
import { WalletPicker, walletLabel } from "../wallet/WalletPicker";
import { useApp } from "../../context/AppContext";
import { copyToClipboard, formatAda, truncateMiddle } from "../../lib/utils";

export function WalletModal() {
  const {
    modal,
    closeModal,
    wallet,
    isConnected,
    disconnectWallet,
    clearWalletError,
    toast,
  } = useApp();
  const [copied, setCopied] = useState(false);

  const open = modal?.kind === "wallet";
  const isTestnet = wallet.networkId === 0;

  const handleClose = () => {
    clearWalletError();
    closeModal();
  };

  const handleCopy = async () => {
    if (!wallet.address) return;
    const ok = await copyToClipboard(wallet.address);
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 2000);
    else toast({ tone: "error", title: "Could not copy the address" });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isConnected ? "Your wallet" : "Log in with your wallet"}
      description={
        isConnected
          ? "Connected through CIP-30 — we never hold your keys."
          : "Your wallet is your account. No password, no email, no sign-up form."
      }
    >
      {isConnected ? (
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display font-bold text-ink-900">
              {walletLabel(wallet.id)}
            </h3>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isTestnet
                  ? "bg-accent-50 text-accent-700"
                  : "bg-positive-50 text-positive-700"
              }`}
            >
              {wallet.networkId === null
                ? "Unknown network"
                : isTestnet
                  ? "Testnet"
                  : "Mainnet"}
            </span>
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-ink-500">Balance</dt>
              <dd className="tabular font-display text-3xl font-bold text-ink-900">
                {wallet.balanceAda === null
                  ? "—"
                  : `₳${formatAda(wallet.balanceAda)}`}
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">Address</dt>
              <dd className="mt-1.5 flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-700">
                  {wallet.address ? truncateMiddle(wallet.address, 14, 12) : "—"}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy wallet address"
                  className="shrink-0 rounded-lg border border-ink-300 p-2.5 text-ink-600 transition-colors hover:bg-ink-50"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-positive-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => {
              disconnectWallet();
              closeModal();
              toast({ tone: "info", title: "Wallet disconnected" });
            }}
            className="btn-secondary mt-6 w-full"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </button>
        </div>
      ) : (
        <WalletPicker
          onConnected={() => {
            closeModal();
            toast({
              tone: "success",
              title: "Wallet connected",
              description: "You're logged in. Support and memberships are ready.",
            });
          }}
        />
      )}
    </Modal>
  );
}
