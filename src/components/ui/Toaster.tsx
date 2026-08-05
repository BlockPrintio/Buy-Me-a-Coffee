import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Info, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

const TONE = {
  success: { icon: Check, chip: "bg-positive-50 text-positive-500" },
  info: { icon: Info, chip: "bg-brand-50 text-brand-700" },
  error: { icon: AlertCircle, chip: "bg-rose-50 text-rose-700" },
} as const;

export function Toaster() {
  const { toasts, dismissToast } = useApp();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex flex-col items-center gap-2.5 p-4 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      <AnimatePresence initial={false}>
        {toasts.map((item) => {
          const { icon: Icon, chip } = TONE[item.tone];
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-white p-4 shadow-lift"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${chip}`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-900">
                  {item.title}
                </p>
                {item.description && (
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-500">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(item.id)}
                aria-label="Dismiss notification"
                className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
