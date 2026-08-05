/**
 * The ADA sign, drawn rather than typed.
 *
 * No face in this system carries U+20B3, not Anton and not Archivo, so the
 * character falls through to a system font and prints as a thin capital A with
 * a clumsy double strike, at a weight that has nothing to do with the digits
 * beside it. Drawing it fixes both problems at once.
 *
 * It is a filled mark rather than a stroked one, because it almost always sits
 * next to bold or poster-weight numerals: a hairline chevron reads as a lambda
 * at those sizes. Filling it lets the mark take its weight from the type around
 * it, the way a real glyph would.
 *
 * The box is sized to the drawn shape rather than padded out, so a price closes
 * up like a number instead of drifting apart. Callers should not need to add
 * margin; if a gap appears, the fix belongs here.
 *
 * The literal character stays correct in strings a person never sees as type:
 * aria-labels, toasts, page titles. Copy that already carries the character
 * goes through `AdaText`.
 */
export function Ada({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 78 100"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      className={`inline-block h-[0.72em] w-[0.56em] shrink-0 align-[-0.035em] ${className}`}
    >
      {/* The two legs, drawn as one filled chevron. */}
      <path d="M39 4 L77 96 H55 L39 50 L23 96 H1 Z" />
      {/* The bar, at the weight of the legs so the mark reads as one piece. */}
      <path d="M15 57 H63 V77 H15 Z" />
    </svg>
  );
}

/**
 * The same mark, substituted into a string that already carries U+20B3.
 *
 * Some copy arrives as data: a seeded metric, a notification assembled from a
 * template, where the literal character is the natural thing to store. This
 * splits on it at render time so those strings set with the drawn mark too,
 * without every caller having to break its own sentence into fragments.
 */
export function AdaText({ children }: { children: string }) {
  const parts = children.split("₳");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <Ada />}
          {part}
        </span>
      ))}
    </>
  );
}
