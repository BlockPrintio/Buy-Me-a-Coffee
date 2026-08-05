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
import { getCreator, isPayableAddress } from "../../data/creators";
import { Ada } from "../ui/Ada";
import {
  DEMO_CHECKOUT,
  PLATFORM_RATE,
  SITE,
  feeBreakdown,
} from "../../config/site";
import {
  FEE_THRESHOLD_ADA,
  MIN_SUPPORT_ADA,
  explorerTxUrl,
} from "../../config/chain";
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
    getWalletApi,
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
  const [sendError, setSendError] = useState("");
  /** Memberships are prepaid, so the supporter chooses how far ahead to fund. */
  const [periods, setPeriods] = useState(3);
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
    setSendError("");
    setPeriods(3);
    setCopied(false);
  }, [
    request?.creatorId,
    request?.amount,
    request?.tierName,
    request?.recurring,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const fees = useMemo(() => feeBreakdown(amount), [amount]);
  const insufficient =
    wallet.balanceAda !== null && amount > wallet.balanceAda && !recurring;
  /** Caught here rather than at signing time, where it reads as a crash. */
  const belowMinimum = amount > 0 && amount < MIN_SUPPORT_ADA;

  const title = recurring
    ? `Join ${request?.tierName ?? "membership"}`
    : `Support ${creator.name}`;

  const handleContinue = () => {
    if (amount <= 0) return;
    setStep(isConnected ? "review" : "connect");
  };

  const handleSend = async () => {
    setStep("sending");
    setSendError("");

    // Three things force a simulated receipt: no chain configuration, a demo
    // wallet with nothing to sign, or a creator whose payout address is one of
    // the illustrative ones rather than a real bech32 address. In every case
    // the receipt is generated locally and labelled as such.
    const simulated =
      DEMO_CHECKOUT ||
      wallet.id === "demo" ||
      !isPayableAddress(creator.walletAddress);

    let hash: string;
    if (simulated) {
      await new Promise((resolve) => window.setTimeout(resolve, 1400));
      hash = randomHex(64);
    } else {
      const walletApi = getWalletApi();
      if (!walletApi) {
        setSendError(
          "The wallet connection was lost. Reconnect and try again.",
        );
        setStep("review");
        return;
      }
      try {
        // ~2.6 MB of WebAssembly serialisation code lives behind these
        // imports. Loading on demand keeps it off the landing page entirely.
        if (recurring) {
          // A membership locks every funded period at the script up front; the
          // creator draws them down one at a time and the supporter can stop
          // and reclaim whatever has not been earned.
          const { startMembership } =
            await import("../../services/membershipTx");
          const result = await startMembership({
            walletApi,
            creatorAddress: creator.walletAddress,
            amountPerPeriodAda: amount,
            periods,
            walletNetworkId: wallet.networkId,
          });
          hash = result.txHash;
        } else {
          const { sendSupport } = await import("../../services/supportTx");
          const result = await sendSupport({
            walletApi,
            creatorAddress: creator.walletAddress,
            creatorHandle: creator.handle,
            amountAda: amount,
            message: message.trim(),
            walletNetworkId: wallet.networkId,
          });
          hash = result.txHash;
        }
      } catch (error) {
        setSendError(
          error instanceof Error
            ? error.message
            : "The transaction could not be submitted.",
        );
        setStep("review");
        toast({ tone: "error", title: "Support not sent" });
        return;
      }
    }
    setTxHash(hash);
    recordSupport({
      creatorId: creator.id,
      supporter: supporter.trim() || "Anonymous",
      amount,
      message: message.trim(),
      txHash: hash,
      recurring,
      tierName: request?.tierName,
      demo: simulated,
    });
    setStep("done");
    toast({
      tone: "success",
      title: recurring
        ? `${request?.tierName} membership started`
        : `₳${formatAdaSmart(amount)} sent to ${creator.name}`,
      description: simulated
        ? "Demo checkout. No ADA left your wallet."
        : "Settled on-chain.",
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
            ? `₳${formatAdaSmart(amount)} a month, funded up front and released one month at a time.`
            : creator.role
      }
    >
      {" "}
      {/* ------------------------------------------------------- details */}{" "}
      {step === "details" && (
        <div>
          <CreatorRow />
          {recurring && (
            <fieldset className="mt-6">
              <legend className="text-sm font-800 text-ink-900">
                Fund how many months up front?
              </legend>
              <p className="mt-1 text-sm text-ink-500">
                A blockchain has no scheduler, so the months you fund are locked
                now and released to {creator.name} one at a time. Cancel
                whenever and the unearned balance comes back to you.
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2.5">
                {[1, 3, 6, 12].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setPeriods(count)}
                    aria-pressed={periods === count}
                    className={`tabular py-3 text-sm font-700 transition-all duration-200 ease-press ${
                      periods === count
                        ? "bg-brand-500 text-ink-50"
                        : "border border-ink-300 bg-ink-50 text-ink-700 hover:border-brand-500 hover:text-brand-500"
                    }`}
                  >
                    {count} mo
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm font-700 text-ink-900">
                Locking <Ada />{formatAda(amount * periods)} now.
              </p>
            </fieldset>
          )}
          {!recurring && (
            <fieldset className="mt-6">
              <legend className="text-sm font-800 text-ink-900">
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
                      className={`tabular py-3 text-sm font-700 transition-all duration-200 ease-press ${
                        active
                          ? "bg-brand-500 text-ink-50"
                          : "border border-ink-300 bg-ink-50 text-ink-700 hover:border-brand-500 hover:text-brand-500"
                      }`}
                    >
                      <Ada />{preset}
                    </button>
                  );
                })}
              </div>

              <label
                htmlFor="support-custom"
                className="mt-3 block text-sm font-500 text-ink-500"
              >
                Or enter your own
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">
                  <Ada />
                </span>
                <input
                  id="support-custom"
                  type="number"
                  min={MIN_SUPPORT_ADA}
                  step={1}
                  inputMode="decimal"
                  value={custom}
                  onChange={(event) => {
                    const raw = event.target.value;
                    setCustom(raw);
                    const parsed = Number.parseFloat(raw);
                    if (Number.isFinite(parsed) && parsed > 0)
                      setAmount(parsed);
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
                className="text-sm font-800 text-ink-900"
              >
                Your name{" "}
                <span className="font-500 text-ink-400">(optional)</span>
              </label>
              <input
                id="support-name"
                value={supporter}
                onChange={(event) =>
                  setSupporter(event.target.value.slice(0, 40))
                }
                placeholder="Anonymous"
                className="field mt-2"
              />
            </div>

            <div>
              <label
                htmlFor="support-note"
                className="flex items-center justify-between text-sm font-800 text-ink-900"
              >
                Add a message
                <span className="tabular text-xs font-500 text-ink-400">
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
          {belowMinimum && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2  bg-accent-50 p-3 text-sm leading-relaxed text-accent-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Cardano will not create an output smaller than its minimum-ada
              deposit, so <Ada />{MIN_SUPPORT_ADA} is the smallest support that can
              settle on-chain.
            </p>
          )}
          {insufficient && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2  bg-accent-50 p-3 text-sm text-accent-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              That is more than your connected wallet holds (<Ada />
              {formatAda(wallet.balanceAda ?? 0)}). Lower the amount or top up
              first.
            </p>
          )}
          <button
            type="button"
            onClick={handleContinue}
            disabled={amount <= 0 || belowMinimum || insufficient}
            className="btn-primary mt-6 w-full"
          >
            {recurring ? (
              <Repeat className="h-4 w-4" />
            ) : (
              <Coffee className="h-4 w-4" />
            )}{" "}
            Continue · <Ada />{formatAdaSmart(amount)} {recurring ? "/mo" : ""}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Non-custodial: funds never
            touch our wallet{" "}
          </p>{" "}
        </div>
      )}{" "}
      {/* ------------------------------------------------------- connect */}{" "}
      {step === "connect" && (
        <div>
          <BackButton onClick={() => setStep("details")} />
          <p className="mb-5 text-sm leading-relaxed text-ink-500">
            Connect the wallet you want to pay from. Support goes straight from
            it to {creator.name}, and nothing is held in between.
          </p>
          <WalletPicker onConnected={() => setStep("review")} />
        </div>
      )}
      {/* -------------------------------------------------------- review */}
      {step === "review" && (
        <div>
          <BackButton onClick={() => setStep("details")} />
          <CreatorRow />

          <dl className="mt-6 space-y-3  border border-ink-200 p-4 text-sm">
            <Row label={recurring ? "Per month" : "Amount"}>
              <Ada />{formatAda(amount)}
            </Row>
            <Row label="Lovelace">
              {Math.round(amount * 1_000_000).toLocaleString("en-US")}
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
            <p className="mt-4 flex items-start gap-2  bg-accent-50 p-3 text-sm leading-relaxed text-accent-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong className="font-700">Demo checkout.</strong> This build
                has no transaction backend, so confirming records the support
                locally and no ADA leaves your wallet.
              </span>
            </p>
          )}

          {/* A failed submit drops back to this step, so the reason has to be
              visible here — a toast that has already faded is not an answer. */}
          {sendError && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2  bg-rose-50 p-3 text-sm leading-relaxed text-rose-800"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {sendError}
            </p>
          )}

          <button
            type="button"
            onClick={handleSend}
            className="btn-primary mt-6 w-full"
          >
            {" "}
            {sendError ? "Try again · " : "Confirm and send "}<Ada />
            {formatAdaSmart(amount)}
            {recurring ? "/mo" : ""}
          </button>
        </div>
      )}
      {/* ------------------------------------------------------- sending */}
      {step === "sending" && (
        <div className="flex flex-col items-center py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          <p className="mt-5 font-display text-lg font-800 text-ink-900">
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
          <span className="mx-auto flex h-14 w-14 items-center justify-center  bg-positive-50 text-positive-500">
            <Check className="h-7 w-7" strokeWidth={3} />
          </span>
          <h3 className="mt-5 font-display text-xl font-800 text-ink-900">
            {recurring
              ? `You're a ${request?.tierName} member`
              : `₳${formatAdaSmart(amount)} on its way to ${creator.name}`}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
            {recurring
              ? `${periods} month${periods === 1 ? "" : "s"} funded. ${creator.name} can claim one a month; cancel any time to reclaim the rest.`
              : `${creator.name} receives ₳${formatAda(fees.creatorReceives)} in full, and your message lands with it.`}
          </p>

          <div className="mt-6  bg-ink-50 p-4 text-left">
            <p className="text-xs font-700 uppercase tracking-wide text-ink-400">
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
                className="shrink-0  border border-ink-300 bg-ink-50 p-2 text-ink-600 transition-colors hover:bg-ink-50"
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
                Locally generated for the demo, so it will not resolve on an
                explorer.
              </p>
            ) : (
              <a
                href={explorerTxUrl(txHash)}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-700 text-brand-500 hover:text-brand-600"
              >
                View on Cardanoscan
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => openSupport({ creatorId: creator.id, amount: 5 })}
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
      <div className="flex items-center gap-3.5  bg-ink-50 p-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center  text-base font-800 text-ink-50 ${creator.tint}`}
        >
          {creator.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-700 text-ink-900">{creator.name}</p>
          <p className="truncate text-sm text-ink-500">
            {SITE.domain}/{creator.handle}
          </p>
        </div>
      </div>
    );
  }

  function FeeTable() {
    if (recurring) {
      return (
        <dl className="mt-5 space-y-2.5  bg-ink-50 p-4 text-sm">
          <Row label="Per month" strong>
            <Ada />{formatAda(amount)}
          </Row>
          <Row label="Months funded now">{periods}</Row>
          <Row label="Network fee (paid to Cardano)">
            +<Ada />{formatAda(fees.networkFee)}
          </Row>
          <div className="h-px bg-ink-200" />
          <div className="flex items-center justify-between">
            <dt className="font-700 text-ink-900">Locked at the contract</dt>
            <dd className="tabular font-800 text-positive-500">
              <Ada />{formatAda(amount * periods)}
            </dd>
          </div>
          <p className="pt-1 text-xs leading-relaxed text-ink-400">
            {creator.name} can draw one month at a time; the rest stays locked
            and returns to you if you cancel. No platform fee on memberships.
          </p>
        </dl>
      );
    }

    return (
      <dl className="mt-5 space-y-2.5  bg-ink-50 p-4 text-sm">
        <Row label="You send" strong>
          {" "}
          <Ada />{formatAda(amount)}{" "}
        </Row>{" "}
        <Row
          label={
            fees.feeWaived ? (
              <>
                Platform fee (waived under <Ada />
                {FEE_THRESHOLD_ADA})
              </>
            ) : (
              `Platform fee (${(PLATFORM_RATE * 100).toFixed(1)}%)`
            )
          }
        >
          {fees.feeWaived ? (
            <>
              <Ada />
              0.00
            </>
          ) : (
            <>
              +<Ada />
              {formatAda(fees.platformFee)}
            </>
          )}
        </Row>
        <Row label="Network fee (paid to Cardano)">
          +<Ada />{formatAda(fees.networkFee)}
        </Row>
        <div className="h-px bg-ink-200" />
        <div className="flex items-center justify-between">
          <dt className="font-700 text-ink-900">{creator.name} receives</dt>
          <dd className="tabular font-800 text-positive-500">
            <Ada />{formatAda(fees.creatorReceives)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ink-500">Total from your wallet</dt>
          <dd className="tabular text-ink-700"><Ada />{formatAda(fees.totalPaid)}</dd>
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
  /** A node, not a string: labels carry the drawn ADA mark. */
  label: ReactNode;
  strong?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="shrink-0 text-ink-500">{label}</dt>
      <dd
        className={`tabular min-w-0 truncate text-right ${
          strong ? "font-800 text-ink-900" : "text-ink-600"
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
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-700 text-ink-500 transition-colors hover:text-ink-900"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}
