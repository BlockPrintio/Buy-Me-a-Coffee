import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import CardanoWalletService, {
  type WalletName,
} from "../services/cardanoWallet";
import { CREATORS, getCreator } from "../data/creators";
import { uid } from "../lib/utils";

/* ------------------------------------------------------------------ types */

/** `demo` is a stand-in signer so the flow is walkable without an extension. */
export type WalletId = WalletName | "demo";

export interface WalletState {
  id: WalletId | null;
  address: string | null;
  balanceAda: number | null;
  networkId: number | null;
  /** Which wallet is mid-connect, so only that row shows a spinner. */
  connecting: WalletId | null;
  error: string | null;
}

export interface SupportEntry {
  id: string;
  creatorId: string;
  supporter: string;
  amount: number;
  message: string;
  txHash: string;
  ts: number;
  recurring: boolean;
  tierName?: string;
  demo: boolean;
}

export interface CreatorPage {
  handle: string;
  displayName: string;
  bio: string;
  category: string;
  walletAddress: string;
  createdAt: number;
}

export type Modal =
  | { kind: "wallet" }
  | {
      kind: "support";
      creatorId: string;
      amount: number;
      message?: string;
      recurring?: boolean;
      tierName?: string;
    }
  | { kind: "start-page" }
  | { kind: "creators" }
  | { kind: "legal"; doc: "privacy" | "terms" }
  | null;

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone: "success" | "info" | "error";
}

interface AppContextValue {
  wallet: WalletState;
  isConnected: boolean;
  installedWallets: WalletName[];
  connectWallet: (id: WalletId) => Promise<boolean>;
  disconnectWallet: () => void;
  clearWalletError: () => void;

  modal: Modal;
  openModal: (modal: NonNullable<Modal>) => void;
  closeModal: () => void;
  openSupport: (options: {
    creatorId: string;
    amount?: number;
    message?: string;
    recurring?: boolean;
    tierName?: string;
  }) => void;

  supports: SupportEntry[];
  recordSupport: (entry: Omit<SupportEntry, "id" | "ts">) => SupportEntry;
  supportsFor: (creatorId: string) => SupportEntry[];
  statsFor: (creatorId: string) => { earned: number; supporters: number };

  page: CreatorPage | null;
  savePage: (page: Omit<CreatorPage, "createdAt">) => void;
  clearPage: () => void;

  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

/* ------------------------------------------------------------- persistence */

const KEYS = {
  wallet: "supportada:wallet",
  supports: "supportada:supports",
  page: "supportada:page",
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage can be full or blocked — the session still works without it */
  }
}

/* The feed starts with a few supports so "Recent support" is never empty. */
const HOUR = 60 * 60 * 1000;
const SEED_SUPPORTS: SupportEntry[] = [
  {
    id: "seed_1",
    creatorId: "luna-dev",
    supporter: "Alex",
    amount: 10,
    message: "Love your Aiken tutorials!",
    txHash: "8f2c1a9d4b7e60c3a5f81d2e9b043c7a6d5e8f19",
    ts: Date.now() - 2 * HOUR,
    recurring: false,
    demo: true,
  },
  {
    id: "seed_2",
    creatorId: "luna-dev",
    supporter: "Jamie",
    amount: 5,
    message: "Keep up the amazing work!",
    txHash: "3d7b5e21c8f04a96d2e7b1c5a839f04e6c2d7b18",
    ts: Date.now() - 7 * HOUR,
    recurring: false,
    demo: true,
  },
  {
    id: "seed_3",
    creatorId: "luna-dev",
    supporter: "Taylor",
    amount: 25,
    message: "Your docs saved us hours.",
    txHash: "b1e9c47a0d3f82b65c1a9e7d40f3b28c6a5d9e10",
    ts: Date.now() - 26 * HOUR,
    recurring: false,
    demo: true,
  },
];

const DEMO_ADDRESS =
  "addr1qxd3m0ck9uv7ht2s5p8w4qz6r0y1n3j5l7f9h2k4m6p8s0t2v4x6z8b0d2f4h6j8l0n2q4s6u8w0y2a4c6e8g0j2l4n6q8s";

/* ---------------------------------------------------------------- context */

const AppContext = createContext<AppContextValue | null>(null);

const EMPTY_WALLET: WalletState = {
  id: null,
  address: null,
  balanceAda: null,
  networkId: null,
  connecting: null,
  error: null,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>(EMPTY_WALLET);
  const [installedWallets, setInstalledWallets] = useState<WalletName[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [supports, setSupports] = useState<SupportEntry[]>(SEED_SUPPORTS);
  const [page, setPage] = useState<CreatorPage | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /** One service instance for the app's lifetime — a per-render instance
   *  would lose the CIP-30 handle and make disconnect a no-op. */
  const serviceRef = useRef<CardanoWalletService>();
  if (!serviceRef.current) serviceRef.current = new CardanoWalletService();

  /* --------------------------------------------------------------- toasts */

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((next: Omit<Toast, "id">) => {
    const id = uid("toast");
    setToasts((prev) => [...prev, { ...next, id }]);
    window.setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      5200,
    );
  }, []);

  /* -------------------------------------------------- restore local state */

  useEffect(() => {
    const storedSupports = readJson<SupportEntry[] | null>(KEYS.supports, null);
    if (storedSupports && storedSupports.length > 0) {
      setSupports([...storedSupports, ...SEED_SUPPORTS]);
    }
    setPage(readJson<CreatorPage | null>(KEYS.page, null));
  }, []);

  /* ---------------------------------------------- detect + restore wallet */

  useEffect(() => {
    // Extensions inject `window.cardano` asynchronously, so poll briefly
    // instead of reading once on mount and reporting "none installed".
    let attempts = 0;
    const timer = window.setInterval(() => {
      const found = CardanoWalletService.getAvailableWallets();
      setInstalledWallets((prev) =>
        prev.length === found.length && prev.every((p) => found.includes(p))
          ? prev
          : found,
      );
      if (++attempts >= 6) window.clearInterval(timer);
    }, 400);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const previous = readJson<WalletId | null>(KEYS.wallet, null);
    if (!previous) return;

    let cancelled = false;

    if (previous === "demo") {
      setWallet({
        id: "demo",
        address: DEMO_ADDRESS,
        balanceAda: 250,
        networkId: 1,
        connecting: null,
        error: null,
      });
      return;
    }

    (async () => {
      try {
        await serviceRef.current!.connect(previous);
        const [address, balanceAda, networkId] = await Promise.all([
          serviceRef.current!.getAddress(),
          serviceRef.current!.getBalanceInADA(),
          serviceRef.current!.getNetworkId(),
        ]);
        if (cancelled || !address) return;
        setWallet({
          id: previous,
          address,
          balanceAda,
          networkId,
          connecting: null,
          error: null,
        });
      } catch {
        localStorage.removeItem(KEYS.wallet);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* --------------------------------------------------------- wallet verbs */

  const connectWallet = useCallback(
    async (id: WalletId): Promise<boolean> => {
      setWallet((prev) => ({ ...prev, connecting: id, error: null }));

      if (id === "demo") {
        // A local stand-in signer. Nothing is broadcast and no keys exist.
        await new Promise((resolve) => window.setTimeout(resolve, 450));
        setWallet({
          id: "demo",
          address: DEMO_ADDRESS,
          balanceAda: 250,
          networkId: 1,
          connecting: null,
          error: null,
        });
        writeJson(KEYS.wallet, "demo");
        return true;
      }

      try {
        await serviceRef.current!.connect(id);
        const [address, balanceAda, networkId] = await Promise.all([
          serviceRef.current!.getAddress(),
          serviceRef.current!.getBalanceInADA(),
          serviceRef.current!.getNetworkId(),
        ]);

        if (!address) {
          throw new Error(
            "Connected, but the wallet returned no address. Check that it is unlocked.",
          );
        }

        setWallet({
          id,
          address,
          balanceAda,
          networkId,
          connecting: null,
          error: null,
        });
        writeJson(KEYS.wallet, id);
        return true;
      } catch (error) {
        setWallet((prev) => ({
          ...prev,
          connecting: null,
          error:
            error instanceof Error
              ? error.message
              : "Could not connect to that wallet.",
        }));
        return false;
      }
    },
    [],
  );

  const disconnectWallet = useCallback(() => {
    serviceRef.current!.disconnect();
    setWallet(EMPTY_WALLET);
    localStorage.removeItem(KEYS.wallet);
  }, []);

  const clearWalletError = useCallback(() => {
    setWallet((prev) => (prev.error ? { ...prev, error: null } : prev));
  }, []);

  /* ---------------------------------------------------------------- modal */

  const openModal = useCallback((next: NonNullable<Modal>) => {
    setModal(next);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const openSupport = useCallback<AppContextValue["openSupport"]>(
    ({ creatorId, amount = 5, message, recurring = false, tierName }) => {
      setModal({ kind: "support", creatorId, amount, message, recurring, tierName });
    },
    [],
  );

  /* ------------------------------------------------------------- supports */

  const recordSupport = useCallback(
    (entry: Omit<SupportEntry, "id" | "ts">): SupportEntry => {
      const full: SupportEntry = { ...entry, id: uid("support"), ts: Date.now() };
      setSupports((prev) => {
        const next = [full, ...prev];
        writeJson(
          KEYS.supports,
          next.filter((s) => !s.id.startsWith("seed_")).slice(0, 30),
        );
        return next;
      });
      return full;
    },
    [],
  );

  const supportsFor = useCallback(
    (creatorId: string) => supports.filter((s) => s.creatorId === creatorId),
    [supports],
  );

  const statsFor = useCallback(
    (creatorId: string) => {
      const creator = getCreator(creatorId);
      const own = supports.filter(
        (s) => s.creatorId === creatorId && !s.id.startsWith("seed_"),
      );
      return {
        earned:
          creator.baseEarned + own.reduce((total, s) => total + s.amount, 0),
        supporters: creator.baseSupporters + own.length,
      };
    },
    [supports],
  );

  /* ----------------------------------------------------------------- page */

  const savePage = useCallback(
    (next: Omit<CreatorPage, "createdAt">) => {
      const full: CreatorPage = { ...next, createdAt: Date.now() };
      setPage(full);
      writeJson(KEYS.page, full);
    },
    [],
  );

  const clearPage = useCallback(() => {
    setPage(null);
    localStorage.removeItem(KEYS.page);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      wallet,
      isConnected: wallet.id !== null && wallet.address !== null,
      installedWallets,
      connectWallet,
      disconnectWallet,
      clearWalletError,
      modal,
      openModal,
      closeModal,
      openSupport,
      supports,
      recordSupport,
      supportsFor,
      statsFor,
      page,
      savePage,
      clearPage,
      toasts,
      toast,
      dismissToast,
    }),
    [
      wallet,
      installedWallets,
      connectWallet,
      disconnectWallet,
      clearWalletError,
      modal,
      openModal,
      closeModal,
      openSupport,
      supports,
      recordSupport,
      supportsFor,
      statsFor,
      page,
      savePage,
      clearPage,
      toasts,
      toast,
      dismissToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export { CREATORS };
