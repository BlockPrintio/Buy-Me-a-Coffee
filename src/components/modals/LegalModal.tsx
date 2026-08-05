import { Modal } from "../ui/Modal";
import { useApp } from "../../context/AppContext";
import { SITE } from "../../config/site";

/**
 * Summaries, not a substitute for reviewed policies — the copy says so
 * plainly rather than dressing placeholder text up as a legal document.
 */
const DOCS = {
  privacy: {
    title: "Privacy",
    intro:
      "Support Ada is non-custodial, which keeps the data footprint small by design.",
    points: [
      "No account, email or password is required to support a creator; your wallet is the identity.",
      "We never receive or store your private keys, seed phrase or signing material.",
      "Wallet address, balance and network are read in the browser through CIP-30 and are not sent anywhere by this build.",
      "Your page details and support history in this build are stored in your own browser's local storage. Clearing site data removes them.",
      "Transactions that settle on Cardano are public by nature: anyone can read amounts and addresses on-chain.",
    ],
  },
  terms: {
    title: "Terms",
    intro:
      "The short version of how the service works and what it does not promise.",
    points: [
      "Support Ada takes a 2.5% platform fee on amounts received. Cardano network fees (around ₳0.17) are paid to the network, not to us.",
      "Funds move directly between wallets. We do not hold, escrow or refund them, and on-chain transfers cannot be reversed.",
      "You are responsible for the content on your page and for any tax owed on what you receive.",
      "Memberships renew monthly until cancelled, and can be cancelled at any time from your dashboard.",
      "The service is provided as-is, without warranty. We can suspend pages that break the law or the rules above.",
    ],
  },
} as const;

export function LegalModal() {
  const { modal, closeModal } = useApp();

  const open = modal?.kind === "legal";
  const doc = modal?.kind === "legal" ? DOCS[modal.doc] : DOCS.privacy;

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title={doc.title}
      description={doc.intro}
    >
      <ul className="space-y-4">
        {doc.points.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-relaxed">
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
            />
            <span className="text-ink-500">{point}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6  bg-ink-50 p-4 text-sm leading-relaxed text-ink-500">
        This is a plain-language summary for a demo build, not a reviewed legal
        document. Questions?{" "}
        <a
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(`${doc.title} question`)}`}
          className="font-700 text-brand-500 underline-offset-2 hover:underline"
        >
          {SITE.email}
        </a>
      </p>

      <button
        type="button"
        onClick={closeModal}
        className="btn-secondary mt-6 w-full"
      >
        Close
      </button>
    </Modal>
  );
}
