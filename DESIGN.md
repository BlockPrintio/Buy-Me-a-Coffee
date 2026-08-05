# Design system — Socialist Kiosk Print

Recorded from the built result, not from intention. Tokens live in
`tailwind.config.js`; the component layer lives in `src/index.css`.

## The idea

Support is a public act, so the page is printed like a public notice rather
than assembled like a SaaS landing page. Everything is a printed block: ruled
edge, flat fill, square corner. There is no radius, no gradient, no glow, and
no soft elevation anywhere in the system.

## Ink

Four plates on a cool sheet. Colour commits at page scale — whole sections take
a plate, rather than accents being scattered over neutral.

| Role | Token | Value | Used for |
|---|---|---|---|
| Plate 1 | `brand-500` | `#0033AD` | Hero field, closing field, primary buttons, popular tier |
| Plate 2 | `accent-500` / `accent-200` | `#6A3AC8` / `#C6AEEF` | Second-plate marks, the headline's struck word |
| Sheet | `ink-50` | `#F2F4F8` | Paper; the default page ground |
| Press black | `ink-950` | `#080A0E` | Every rule and border, the nav band, the support field |
| Affirmative | `positive-500` | `#1B7340` | Verification marks only |

Section rhythm alternates deliberately: blue field → sheet → press black →
sheet → second sheet → sheet → second sheet → blue field → press black.

**Every text/background pair in the built page passes WCAG AA.** This was
measured on the rendered DOM, not assumed from the palette. Copy on the blue
field is `ink-50`, never `ink-950`.

## Type

| Role | Face | Notes |
|---|---|---|
| Display | **Anton** | One weight only. Hierarchy comes from size and case, never faux bold. Always uppercase, `.lockup` pulls tracking to -0.02em and leading to 0.88 |
| Text | **Archivo** | 400/500/700/800. `.label` is the small tracked caps voice |
| Machine data | **Courier Prime** | Transaction hashes, addresses, docket rows. Never as a costume for "technical" |

`h1`–`h3` are display caps by default. The `fontSize` scale carries its own
leading and tracking per step so headlines lock up as blocks.

### The ADA sign

No face in the system carries U+20B3 — not Anton, not Archivo, and none of the
Google candidates tested. The character falls through to a system font and
prints thin and short beside heavy poster digits. `src/components/ui/Ada.tsx`
draws it instead: two strokes, `currentColor`, weight in viewBox units
(`22` beside Anton, `15` beside Archivo 800). Use it where the sign is *set*;
the literal character is still correct in aria-labels, toasts, and titles.

## Material

- **Rules** are 3px (`border-3`), the system's fundamental line. 1px hairlines
  (`.rule`) exist only inside blocks.
- **`shadow-plate`** is a hard 6px offset with zero blur — a second plate struck
  out of register, not elevation. Buttons move *into* their own shadow on
  hover, the way a stamp presses down.
- **`.screen`** classes lay a halftone dot screen over a field at low alpha.
- **`.cut-up` / `.cut-down`** are hard diagonal clip-paths for section folds.
- **`.skew-plate`** rotates a block ~1.4° for out-of-register marks.

## Motion

One authored moment: `animate-ink-in`, the plates settling onto the sheet, used
once in the hero with staggered `animationDelay`.

The keyframe is **transform-only, deliberately**. Copy is legible before,
during and after, so a slow script or a failed hydration never leaves a blank
page. The previous build had fifteen near-identical `whileInView` fade-ups —
one entrance on every section — and they left every heading invisible when the
observer did not fire. They were removed, not tuned.

## Rules this system keeps

- No border radius. `borderRadius` is zeroed globally; `rounded-full` survives
  only for the live pulse dot.
- No gradient, no glass, no blur-as-decoration, no zero-offset halo.
- Icons are drawn: lucide-react at one stroke weight, plus the authored `Ada`.
- Section numbers appear only in "Live in three steps", where the sequence is
  the information.
- No eyebrow or kicker above any heading.

## Known state

- `PRODUCT.md` records product truth. The figures on the page (10,000 creators,
  ₳2.5M, 4.9 average, per-creator totals) are **demonstration data** on the
  replacement list.
- The direction contract is an HTML comment at the top of `index.html`'s body
  and survives the production build (`grep DIRECTION: dist/index.html`).
