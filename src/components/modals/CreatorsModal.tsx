import { useMemo, useState } from "react";
import { Check, Coffee, Search } from "lucide-react";
import { Modal } from "../ui/Modal";
import { useApp } from "../../context/AppContext";
import { CREATORS } from "../../data/creators";
import { SITE } from "../../config/site";
import { formatAda } from "../../lib/utils";
import { Ada } from "../ui/Ada";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "developer", label: "Developers" },
  { value: "artist", label: "Artists" },
  { value: "spo", label: "Stake pools" },
  { value: "educator", label: "Educators" },
  { value: "other", label: "Other" },
] as const;

export function CreatorsModal() {
  const { modal, closeModal, openSupport, statsFor } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const open = modal?.kind === "creators";

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CREATORS.filter((creator) => {
      const matchesFilter = filter === "all" || creator.category === filter;
      const matchesQuery =
        needle.length === 0 ||
        creator.name.toLowerCase().includes(needle) ||
        creator.handle.toLowerCase().includes(needle) ||
        creator.role.toLowerCase().includes(needle) ||
        creator.bio.toLowerCase().includes(needle);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <Modal
      open={open}
      onClose={closeModal}
      size="lg"
      title="Browse creators"
      description="People funding their work on Cardano right now. Support any of them in a couple of taps."
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, handle or what they make"
          aria-label="Search creators"
          className="field pl-11"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const active = filter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={active}
              className={` px-3 py-2 text-sm font-700 transition-colors ${
                active
                  ? "bg-brand-500 text-ink-50"
                  : "border border-ink-300 text-ink-600 hover:border-brand-500 hover:text-brand-500"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {results.length === 0 ? (
        <p className="py-14 text-center text-sm text-ink-500">
          No creators match “{query}”. Try a different search.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-ink-200 border-t border-ink-200">
          {results.map((creator) => {
            const stats = statsFor(creator.id);
            return (
              <li
                key={creator.id}
                className="flex flex-wrap items-start gap-4 py-5"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center  text-sm font-800 text-ink-50 ${creator.tint}`}
                >
                  {creator.initials}
                </span>

                <div className="min-w-[12rem] flex-1">
                  <p className="flex items-center gap-1.5 font-700 text-ink-900">
                    <span className="truncate">{creator.name}</span>
                    {creator.verified && (
                      <span
                        title="Verified creator"
                        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-positive-500 text-ink-50"
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={4} />
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-ink-500">
                    {SITE.domain}/{creator.handle} · {creator.role}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                    {creator.bio}
                  </p>
                  <p className="tabular mt-2 text-xs font-700 text-ink-400">
                    <Ada />{formatAda(stats.earned, 0)} raised from {stats.supporters}{" "}
                    supporters
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openSupport({ creatorId: creator.id, amount: 5 })
                  }
                  className="btn-secondary btn-sm shrink-0"
                >
                  <Coffee className="h-4 w-4" />
                  Support
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
