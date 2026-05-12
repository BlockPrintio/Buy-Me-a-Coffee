
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Cardano ecosystem colors
        cardano: {
          blue: '#0033AD',
          cyan: '#00C2D1',
          purple: '#6A3AC8',
          bg: '#F7F9FC',
          dark: '#0A142F',
        },
        // Dark theme palette
        dark: {
          base: '#0A1428',
          surface: '#1a1f3a',
          card: '#2a3050',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(26, 188, 156, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(26, 188, 156, 0.6)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      },
      backgroundImage: {
        'gradient-cardano': 'linear-gradient(135deg, #0033A0 0%, #6A3AC8 50%, #23A2B0 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF6B00 0%, #FF9500 100%)',
      }
    },
  },
  plugins: [],
}
