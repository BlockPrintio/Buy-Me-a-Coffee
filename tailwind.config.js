/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /**
         * Cardano's own inks, printed like a poster.
         *
         * `brand` is the Cardano blue plate and carries whole fields; `accent`
         * is the purple second plate; `ink` runs paper to press black on a cool
         * neutral so it sits with blue rather than fighting it.
         *
         * Every pairing this system actually uses clears WCAG AA. The values
         * are chosen for that, not picked and hoped over: a light-purple plate
         * on the blue field separates at 5.15:1, paper type on the field at
         * 9.18:1, and blue type on paper at 9.18:1.
         */

        // Plate 1 — Cardano blue. Covers whole fields; type on it is paper.
        brand: {
          50: '#EBF0FB',
          100: '#D2DEF6',
          200: '#A3BCEC',
          300: '#6E92DF',
          400: '#3A66CE',
          500: '#0033AD', // Cardano blue
          600: '#002C93',
          700: '#002478',
          800: '#001B5C',
          900: '#001440',
          950: '#000C26',
        },

        // Plate 2 — purple. Light steps are struck onto the blue field; dark
        // steps are for type on paper. 400 is decorative only: it reads 4.32:1
        // on the sheet, so text uses 500 or darker.
        accent: {
          50: '#F1EBFB',
          100: '#E2D6F7',
          200: '#C6AEEF',
          300: '#A681E4',
          400: '#8659D6',
          500: '#6A3AC8',
          600: '#5A2FAB',
          700: '#49258C',
          800: '#381C6B',
          900: '#28144D',
        },

        // Paper to press black, cooled so it belongs to the blue family.
        ink: {
          50: '#F2F4F8', // sheet
          100: '#E7EAF1', // second sheet / fill
          200: '#D5DAE6', // rule, hairline
          300: '#B4BCCE', // heavy rule
          400: '#5F6880', // meta text — 5.05:1 on the sheet
          500: '#4A5265', // body text
          600: '#383F4F', // strong body
          700: '#282E3B',
          800: '#1C212B',
          900: '#12161D',
          950: '#080A0E', // press black
        },

        // Plate 3 — press green, only where a figure must read affirmative.
        positive: {
          50: '#E6F2EA',
          500: '#1B7340',
          600: '#14602F',
          700: '#0F4A26',
        },
      },

      fontFamily: {
        // Heavy condensed grotesque: the lettering of the printed poster.
        display: ['Anton', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // A functional grotesque for running text — set, not styled.
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Only for data that is literally machine output: hashes, addresses.
        // A typewriter face, because this is the docket copy, not "tech".
        mono: ['"Courier Prime"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      fontSize: {
        // Poster type is set tight. Every step below carries its own leading
        // and tracking so headlines lock up as blocks rather than as lines.
        '9xl': ['7rem', { lineHeight: '0.86', letterSpacing: '-0.02em' }],
        '8xl': ['5.5rem', { lineHeight: '0.88', letterSpacing: '-0.018em' }],
        '7xl': ['4.5rem', { lineHeight: '0.9', letterSpacing: '-0.016em' }],
        '6xl': ['3.75rem', { lineHeight: '0.92', letterSpacing: '-0.014em' }],
        '5xl': ['3rem', { lineHeight: '0.94', letterSpacing: '-0.012em' }],
        '4xl': ['2.25rem', { lineHeight: '0.98', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.02', letterSpacing: '-0.008em' }],
      },

      // The press does not round corners.
      borderRadius: {
        none: '0',
        DEFAULT: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        '4xl': '0',
        '5xl': '0',
        full: '9999px', // registration dots and the live pulse only
      },

      borderWidth: {
        3: '3px',
        6: '6px',
        10: '10px',
      },

      // The focus ring is a rule like every other line on the sheet.
      outlineWidth: {
        3: '3px',
      },

      /**
       * Ink offset, not elevation. A second plate printed slightly out of
       * register sits flat against the sheet — so these carry a hard offset
       * and no blur, which is the whole point of the effect in this world.
       */
      boxShadow: {
        plate: '6px 6px 0 0 #080A0E',
        'plate-sm': '4px 4px 0 0 #080A0E',
        'plate-lg': '10px 10px 0 0 #080A0E',
        'plate-red': '6px 6px 0 0 #0033AD',
        'plate-paper': '6px 6px 0 0 #F2F4F8',
        // The one true shadow, for the sheet lifting off the press bed.
        sheet: '0 2px 0 0 #080A0E, 0 14px 28px -18px rgba(8,10,14,0.55)',
      },

      backgroundImage: {
        // Halftone dot screen — the texture of cheap colour printing.
        halftone:
          'radial-gradient(#080A0E 1.2px, transparent 1.3px)',
        'halftone-red':
          'radial-gradient(#0033AD 1.4px, transparent 1.5px)',
        'halftone-paper':
          'radial-gradient(#F2F4F8 1.4px, transparent 1.5px)',
      },

      // Named separately from the image keys — a shared name makes
      // `bg-halftone` ambiguous between image and size.
      backgroundSize: {
        screen: '6px 6px',
        'screen-lg': '9px 9px',
      },

      transitionTimingFunction: {
        // A press stroke: fast to contact, then settled.
        press: 'cubic-bezier(0.2, 0.9, 0.1, 1)',
      },

      /**
       * The press stroke: each plate settles onto the sheet. Deliberately
       * transform-only — the copy is legible before, during and after, so a
       * slow script or a failed hydration never leaves a blank page.
       */
      keyframes: {
        'ink-in': {
          '0%': { transform: 'translate3d(0,14px,0)' },
          '100%': { transform: 'none' },
        },
      },

      animation: {
        'ink-in': 'ink-in 0.55s cubic-bezier(0.2,0.9,0.1,1) both',
      },
    },
  },
  plugins: [],
}
