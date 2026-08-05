
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand ramp, anchored on Cardano blue (#0033AD = brand-700)
        brand: {
          50: '#EEF3FF',
          100: '#DCE5FF',
          200: '#BDCEFF',
          300: '#93ADFF',
          400: '#6084FA',
          500: '#3A5EE8',
          600: '#2242CE',
          700: '#0033AD',
          800: '#062A87',
          900: '#0A2464',
          950: '#06143A',
        },
        // Warm counterpoint — the "coffee" side of the product, and a
        // deliberate move away from the blue/cyan default.
        accent: {
          50: '#FFF8ED',
          100: '#FEEFD6',
          200: '#FCDCAC',
          300: '#F9C277',
          400: '#F5A524',
          500: '#DE8500',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#5C2C0D',
        },
        // Blue-tinted neutral ramp. 400/500 are set so body and meta text
        // clear WCAG AA (4.5:1) on white, on ink-50, and on accent-50.
        ink: {
          50: '#F7F8FC',
          100: '#EFF1F7',
          200: '#E2E6F0',
          300: '#CBD2E1',
          400: '#626D84',
          500: '#4E5A72',
          600: '#3A4459',
          700: '#2E3648',
          800: '#242C3D',
          900: '#141A28',
          950: '#0A0E17',
        },
        // Success / verification — emerald-600 fails AA on white, so the
        // ramp starts at a shade that passes.
        positive: {
          50: '#ECFDF5',
          500: '#047857',
          600: '#046C4E',
          700: '#065F46',
        },
      },
      fontFamily: {
        sans: ['"Schibsted Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.032em' }],
        '5xl': ['3rem', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        '4xl': ['2.25rem', { lineHeight: '1.14', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // Every shadow carries a real vertical offset — no zero-offset halos.
      // Surfaces take either a border or a shadow, never both.
      boxShadow: {
        soft: '0 2px 4px -2px rgba(10,20,50,0.10), 0 4px 10px -4px rgba(10,20,50,0.08)',
        card: '0 4px 8px -4px rgba(10,20,50,0.12), 0 12px 24px -10px rgba(10,20,50,0.12)',
        lift: '0 8px 16px -8px rgba(10,20,50,0.16), 0 24px 44px -18px rgba(10,20,50,0.20)',
        float: '0 16px 28px -14px rgba(10,20,60,0.22), 0 36px 64px -28px rgba(10,20,60,0.28)',
        brand: '0 6px 14px -6px rgba(0,51,173,0.45)',
        'brand-lg': '0 12px 26px -10px rgba(0,51,173,0.50)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
