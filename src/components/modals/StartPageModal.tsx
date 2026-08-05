import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Check, Copy, ExternalLink, Sparkles } from "lucide-react";
import { Modal } from "../ui/Modal";
import { WalletPicker } from "../wallet/WalletPicker";
import { useApp } from "../../context/AppContext";
import { SITE } from "../../config/site";
import CreatorProfileService from "../../services/creatorProfile";
import {
  copyToClipboard,
  initialsFrom,
  normalizeHandle,
  truncateMiddle,
} from "../../lib/utils";

const CATEGORIES = [
  { value: "developer", label: "Developer" },
  { value: "artist", label: "Artist" },
  { value: "spo", label: "Stake pool" },
  { value: "educator", label: "Educator" },
  { value: "other", label: "Something else" },
] as const;

type Step = "wallet" | "form" | "done";

export function StartPageModal() {
  const { modal, closeModal, isConnected, wallet, page, savePage, toast } =
    useApp();

  const open = modal?.kind === "start-page";

  const [step, setStep] = useState<Step>("form");
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState<string>("developer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Reopening lands on the page you already made rather than a blank form.
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setCopied(false);
    if (page) {
      setStep("done");
      setHandle(page.handle);
      setDisplayName(page.displayName);
      setBio(page.bio);
      setCategory(page.category);
    } else {
      setStep(isConnected ? "form" : "wallet");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const pageUrl = `${SITE.domain}/${handle || "your-handle"}`;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const next: Record<string, string> = {};
    if (handle.length < 3) next.handle = "Pick a handle of at least 3 characters.";
    if (displayName.trim().length < 2) next.displayName = "Add a display name.";
    if (!isConnected) next.wallet = "Connect a wallet to receive support.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      if (next.wallet) setStep("wallet");
      return;
    }

    const walletAddress = wallet.address ?? "";

    // Registers the profile with the same service the rest of the app reads,
    // then mirrors it into local state so the page survives a reload.
    CreatorProfileService.createProfile({
      username: handle,
      displayName: displayName.trim(),
      bio: bio.trim(),
      walletAddress,
      avatar: initialsFrom(displayName),
      coverImage: "",
      category: category as "developer" | "artist" | "spo" | "educator" | "other",
    });

    savePage({
      handle,
      displayName: displayName.trim(),
      bio: bio.trim(),
      category,
      walletAddress,
    });

    setStep("done");
    toast({
      tone: "success",
      title: "Your page is live",
      description: `${SITE.domain}/${handle} is yours. Share it anywhere.`,
    });
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(`https://${pageUrl}`);
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 2000);
    else toast({ tone: "error", title: "Could not copy the link" });
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title={step === "done" ? "Your page is ready" : "Start your page"}
      description={
        step === "done"
          ? undefined
          : "Two minutes, no KYC, no approval queue. Your wallet is your account."
      }
    >
      {/* --------------------------------------------------- connect first */}
      {step === "wallet" && (
        <div>
          <p className="mb-5 text-sm leading-relaxed text-ink-500">
            Support lands directly in the wallet you connect here, so start by
            choosing one. We never take custody and never see your keys.
          </p>
          <WalletPicker onConnected={() => setStep("form")} />
        </div>
      )}

      {/* ---------------------------------------------------------- form */}
      {step === "form" && (
        <form onSubmit={handleSubmit} noValidate>
          {!page && (
            <button
              type="button"
              onClick={() => setStep("wallet")}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors hover:text-ink-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Wallet
            </button>
          )}

          <div className="mb-5 flex items-center gap-3 rounded-xl bg-positive-50 p-3.5 text-sm text-positive-700">
            <Check className="h-4 w-4 shrink-0" strokeWidth={3} />
            <span className="min-w-0 truncate">
              Payouts go to {truncateMiddle(wallet.address ?? "", 10, 8)}
            </span>
          </div>

          <div className="grid gap-5">
            <Field
              id="page-handle"
              label="Page handle"
              error={errors.handle}
              hint={`Your page will live at ${pageUrl}`}
            >
              <div className="flex items-stretch overflow-hidden rounded-xl border border-ink-300 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
                <span className="flex items-center whitespace-nowrap bg-ink-50 px-3 text-sm text-ink-500">
                  {SITE.domain}/
                </span>
                <input
                  id="page-handle"
                  value={handle}
                  onChange={(event) =>
                    setHandle(normalizeHandle(event.target.value))
                  }
                  placeholder="yourname"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-white px-3 py-3 text-ink-900 outline-none placeholder:text-ink-400"
                />
              </div>
            </Field>

            <Field
              id="page-name"
              label="Display name"
              error={errors.displayName}
            >
              <input
                id="page-name"
                value={displayName}
                onChange={(event) =>
                  setDisplayName(event.target.value.slice(0, 50))
                }
                placeholder="Luna Dev"
                className="field"
              />
            </Field>

            <Field id="page-category" label="What do you make?">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((option) => {
                  const active = category === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setCategory(option.value)}
                      aria-pressed={active}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        active
                          ? "bg-brand-700 text-white"
                          : "border border-ink-300 text-ink-700 hover:border-brand-500 hover:text-brand-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field
              id="page-bio"
              label="Short bio"
              hint="One or two lines. Supporters read this before they send anything."
            >
              <textarea
                id="page-bio"
                rows={3}
                value={bio}
                onChange={(event) => setBio(event.target.value.slice(0, 200))}
                placeholder="Aiken tutorials, open-source validators and weekly deep dives."
                className="field resize-none"
              />
            </Field>
          </div>

          <button type="submit" className="btn-primary mt-6 w-full">
            <Sparkles className="h-4 w-4" />
            {page ? "Save changes" : "Create my page"}
          </button>
          <p className="mt-3 text-center text-xs text-ink-400">
            Free forever. No card, no monthly fee — we only take 2.5% of what
            you receive.
          </p>
        </form>
      )}

      {/* ---------------------------------------------------------- done */}
      {step === "done" && (
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-lg font-bold text-white">
            {initialsFrom(displayName || handle)}
          </span>
          <h3 className="mt-5 font-display text-xl font-bold text-ink-900">
            {displayName}
          </h3>
          {bio && (
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
              {bio}
            </p>
          )}

          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-ink-50 p-3">
            <code className="min-w-0 flex-1 truncate px-1 text-left text-sm text-ink-700">
              {pageUrl}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="btn-secondary btn-sm shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-positive-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-xl bg-accent-50 p-3 text-left text-sm leading-relaxed text-accent-700">
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Saved to this browser. Hosting the page at that URL needs the
              backend that ships with the full product.
            </span>
          </p>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="btn-secondary w-full"
            >
              Edit details
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
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-ink-900">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p role="alert" className="mt-1.5 text-sm text-rose-700">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      )}
    </div>
  );
}
