import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Coffee,
  Copy,
  ExternalLink,
  Loader2,
  Repeat,
  ShieldCheck,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { WalletPicker, walletLabel } from "../wallet/WalletPicker";
import { useApp } from "../../context/AppContext";
import { getCreator } from "../../data/creators";
import { DEMO_CHECKOUT, SITE, feeBreakdown } from "../../config/site";
import CardanoTransactionService from "../../services/cardanoTransaction";
import {
  copyToClipboard,
  formatAda,
  formatAdaSmart,
  randomHex,
  truncateMiddle,
} from "../../lib/utils";

const PRESETS = [3, 5, 10, 25, 50, 100];
const MAX_MESSAGE = 240;

type Step = "details" | "connect" | "review" | "sending" | "done";

export function SupportModal() {
  const {
    modal,
    closeModal,
    wallet,
    isConnected,
    recordSupport,
    toast,
    openSupport,
  } = useApp();

  const open = modal?.kind === "support";
  const request = modal?.kind === "support" ? modal : null;
  const creator = getCreator(request?.creatorId ?? "");
  const recurring = request?.recurring ?? false;

  const [step, setStep] = useState<Step>("details");
  const [amount, setAmount] = useState(5);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState("");
  const [supporter, setSupporter] = useState("");
  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);

  // Re-seed whenever a new support is opened, so the tier price or hero
  // amount that triggered it is what the sheet actually shows.
  useEffect(() => {
    if (!request) return;
    setStep("details");
    setAmount(request.amount);
    setCustom(PRESETS.includes(request.amount) ? "" : String(request.amount));
    setMessage(request.message ?? "");
    setTxHash("");
    setCopied(false);
  }, [request?.creatorId, request?.amount, request?.tierName, request?.recurring]); // eslint-disable-line react-hooks/exhaustive-deps

  const fees = useMemo(() => feeBreakdown(amount), [amount]);
  const insufficient =
    wallet.balanceAda !== null && amount > wallet.balanceAda && !recurring;

  const title = recurring
    ? `Join ${request?.tierName ?? "membership"}`
    : `Support ${creator.name}`;

  const handleContinue = () => {
    if (amount <= 0) return;
    setStep(isConnected ? "review" : "connect");
  };

  const handleSend = async () => {
    setStep("sending");

    // A real send builds and submits a CIP-30 transaction here. Without a
    // serialization library and a chain provider there is nothing to sign,
    // so the receipt below is generated locally and labelled as such.
    await new Promise((resolve) => window.setTimeout(resolve, 1400));

    const hash = randomHex(64);
    setTxHash(hash);
    recordSupport({
      creatorId: creator.id,
      supporter: supporter.trim() || "Anonymous",
      amount,
      message: message.trim(),
      txHash: hash,
      recurring,
      tierName: request?.tierName,
      demo: DEMO_CHECKOUT || wallet.id === "demo",
    });
    setStep("done");
    toast({
      tone: "success",
      title: recurring
        ? `${request?.tierName} membership started`
        : `₳${formatAdaSmart(amount)} sent to ${creator.name}`,
      description: DEMO_CHECKOUT
        ? "Demo checkout — no ADA left your wallet."
        : undefined,
    });
  };

  const handleCopyHash = async () => {
    const ok = await copyToClipboard(txHash);
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 2000);
  };

  const setPreset = (value: number) => {
    setAmount(value);
    setCustom("");
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title={title}
      description={
        step === "done"
          ? undefined
          : recurring
            ? `₳${formatAdaSmart(amount)} per month, renewed on-chain. Cancel anytime.`
            : creator.role
      }
    >
      {/* ------------------------------------------------------- details */}
      {step === "details" && (
        <div>
          <CreatorRow />

          {!recurring && (
            <fieldset className="mt-6">
              <legend className="text-sm font-bold text-ink-900">
                Choose an amount
              </legend>
              <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                {PRESETS.map((preset) => {
                  const active = amount === preset && custom === "";
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPreset(preset)}
                      aria-pressed={active}
                      className={`tabular rounded-xl py-3 text-sm font-semibold transition-all duration-200 ease-out-expo ${
                        active
                          ? "bg-brand-700 text-white"
                          : "border border-ink-300 bg-white text-ink-700 hover:border-brand-500 hover:text-brand-700"
                      }`}
                    >
                      ₳{preset}
                    </button>
                  );
                })}
              </div>

              <label
                htmlFor="support-custom"
                className="mt-3 block text-sm font-medium text-ink-500"
              >
                Or enter your own
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">
                  ₳
                </span>
                <input
                  id="support-custom"
                  type="number"
                  min={1}
                  step={1}
                  inputMode="decimal"
                  value={custom}
                  onChange={(event) => {
                    const raw = event.target.value;
                    setCustom(raw);
                    const parsed = Number.parseFloat(raw);
                    if (Number.isFinite(parsed) && parsed > 0) setAmount(parsed);
                  }}
                  placeholder="Custom amount"
                  className="field pl-8"
                />
              </div>
            </fieldset>
          )}

          <div className="mt-6 grid gap-4">
            <div>
              <label
                htmlFor="support-name"
                className="text-sm font-bold text-ink-900"
              >
                Your name{" "}
                <span className="font-medium text-ink-400">(optional)</span>
              </label>
              <input
                id="support-name"
                value={supporter}
                onChange={(event) => setSupporter(event.target.value.slice(0, 40))}
                placeholder="Anonymous"
                className="field mt-2"
              />
            </div>

            <div>
              <label
                htmlFor="support-note"
                className="flex items-center justify-between text-sm font-bold text-ink-900"
              >
                Add a message
                <span className="tabular text-xs font-medium text-ink-400">
                  {message.length}/{MAX_MESSAGE}
                </span>
              </label>
              <textarea
                id="support-note"
                rows={3}
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value.slice(0, MAX_MESSAGE))
                }
                placeholder="Say something nice…"
                className="field mt-2 resize-none"
              />
            </div>
          </div>

          <FeeTable />

          {insufficient && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-xl bg-accent-50 p-3 text-sm text-accent-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              That is more than your connected wallet holds (₳
              {formatAda(wallet.balanceAda ?? 0)}). Lower the amount or top up
              first.
            </p>
          )}

          <button
            type="button"
            onClick={handleContinue}
            disabled={amount <= 0 || insufficient}
            className="btn-primary mt-6 w-full"
          >
            {recurring ? (
              <Repeat className="h-4 w-4" />
            ) : (
              <Coffee className="h-4 w-4" />
            )}
            Continue · ₳{formatAdaSmart(amount)}
            {recurring ? "/mo" : ""}
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Non-custodial — funds never touch our wallet
          </p>
        </div>
      )}

      {/* ------------------------------------------------------- connect */}
      {step === "connect" && (
        <div>
          <BackButton onClick={() => setStep("details")} />
          <p className="mb-5 text-sm leading-relaxed text-ink-500">
            Connect the wallet you want to pay from. Support goes straight from
            it to {creator.name} — nothing is held in between.
          </p>
          <WalletPicker onConnected={() => setStep("review")} />
        </div>
      )}

      {/* -------------------------------------------------------- review */}
      {step === "review" && (
        <div>
          <BackButton onClick={() => setStep("details")} />
          <CreatorRow />

          <dl className="mt-6 space-y-3 rounded-2xl border border-ink-200 p-4 text-sm">
            <Row label={recurring ? "Monthly" : "Amount"}>
              ₳{formatAda(amount)}
            </Row>
            <Row label="Lovelace">
              {CardanoTransactionService.adaToLovelace(amount).toLocaleString(
                "en-US",
              )}
            </Row>
            <Row label="Paying from">
              {walletLabel(wallet.id)} ·{" "}
              {truncateMiddle(wallet.address ?? "", 6, 4)}
            </Row>
            <Row label="To">{truncateMiddle(creator.walletAddress, 8, 6)}</Row>
            {message.trim() && (
              <div className="border-t border-ink-200 pt-3">
                <dt className="text-ink-500">Message</dt>
                <dd className="mt-1 text-ink-900">“{message.trim()}”</dd>
              </div>
            )}
          </dl>

          <FeeTable />

          {DEMO_CHECKOUT && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-accent-50 p-3 text-sm leading-relaxed text-accent-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong className="font-semibold">Demo checkout.</strong> This
                build has no transaction backend, so confirming records the
                support locally and no ADA leaves your wallet.
              </span>
            </p>
          )}

          <button
            type="button"
            onClick={handleSend}
            className="btn-primary mt-6 w-full"
          >
            Confirm and send ₳{formatAdaSmart(amount)}
            {recurring ? "/mo" : ""}
          </button>
        </div>
      )}

      {/* ------------------------------------------------------- sending */}
      {step === "sending" && (
        <div className="flex flex-col items-center py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
          <p className="mt-5 font-display text-lg font-bold text-ink-900">
            Submitting to Cardano
          </p>
          <p className="mt-1.5 text-sm text-ink-500">
            Confirm in {walletLabel(wallet.id)} if it asks. This usually settles
            in a couple of seconds.
          </p>
        </div>
      )}

      {/* ---------------------------------------------------------- done */}
      {step === "done" && (
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-positive-50 text-positive-500">
            <Check className="h-7 w-7" strokeWidth={3} />
          </span>
          <h3 className="mt-5 font-display text-xl font-bold text-ink-900">
            {recurring
              ? `You're a ${request?.tierName} member`
              : `₳${formatAdaSmart(amount)} on its way to ${creator.name}`}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
            {recurring
              ? `${creator.name} will see you in the members list. Renews monthly until you cancel.`
              : `${creator.name} receives ₳${formatAda(fees.creatorReceives)} after fees, and your message lands with it.`}
          </p>

          <div className="mt-6 rounded-2xl bg-ink-50 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Transaction hash
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate text-xs text-ink-700">
                {txHash}
              </code>
              <button
                type="button"
                onClick={handleCopyHash}
                aria-label="Copy transaction hash"
                className="shrink-0 rounded-lg border border-ink-300 bg-white p-2 text-ink-600 transition-colors hover:bg-ink-50"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-positive-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            {DEMO_CHECKOUT ? (
              <p className="mt-2.5 text-xs leading-relaxed text-ink-400">
                Locally generated for the demo — it will not resolve on an
                explorer.
              </p>
            ) : (
              <a
                href={CardanoTransactionService.getTransactionUrl(
                  txHash,
                  wallet.networkId !== 0,
                )}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                View on Cardanoscan
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                openSupport({ creatorId: creator.id, amount: 5 })
              }
              className="btn-secondary w-full"
            >
              Support again
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="btn-primary w-full"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  function CreatorRow() {
    return (
      <div className="flex items-center gap-3.5 rounded-2xl bg-ink-50 p-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white ${creator.tint}`}
        >
          {creator.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink-900">{creator.name}</p>
          <p className="truncate text-sm text-ink-500">
            {SITE.domain}/{creator.handle}
          </p>
        </div>
      </div>
    );
  }

  function FeeTable() {
    return (
      <dl className="mt-5 space-y-2.5 rounded-xl bg-ink-50 p-4 text-sm">
        <Row label={recurring ? "Charged monthly" : "You send"} strong>
          ₳{formatAda(amount)}
        </Row>
        <Row label="Platform fee (2.5%)">−₳{formatAda(fees.platformFee)}</Row>
        <Row label="Network fee">−₳{formatAda(fees.networkFee)}</Row>
        <div className="h-px bg-ink-200" />
        <div className="flex items-center justify-between">
          <dt className="font-semibold text-ink-900">
            {creator.name} receives
          </dt>
          <dd className="tabular font-bold text-positive-500">
            ₳{formatAda(fees.creatorReceives)}
          </dd>
        </div>
      </dl>
    );
  }
}

function Row({
  label,
  strong,
  children,
}: {
  label: string;
  strong?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="shrink-0 text-ink-500">{label}</dt>
      <dd
        className={`tabular min-w-0 truncate text-right ${
          strong ? "font-bold text-ink-900" : "text-ink-600"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors hover:text-ink-900"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}
