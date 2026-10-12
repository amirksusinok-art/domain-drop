/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0a0d12',
          900: '#10141d',
          850: '#151b26',
          800: '#1c2331',
          700: '#283245',
          600: '#38455e',
          500: '#526280'
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706'
        },
        cyber: {
          cyan: '#06b6d4',
          purple: '#a855f7',
          pink: '#ec4899',
          emerald: '#10b981',
          amber: '#f59e0b'
        },
        tg: {
          bg: 'var(--tg-theme-bg-color, #0b0e14)',
          text: 'var(--tg-theme-text-color, #f3f4f6)',
          hint: 'var(--tg-theme-hint-color, #94a3b8)',
          link: 'var(--tg-theme-link-color, #38bdf8)',
          button: 'var(--tg-theme-button-color, #0284c7)',
          buttonText: 'var(--tg-theme-button-text-color, #ffffff)',
          secondaryBg: 'var(--tg-theme-secondary-bg-color, #111827)',
          headerBg: 'var(--tg-theme-header-bg-color, #0b0e14)',
          accentText: 'var(--tg-theme-accent-text-color, #38bdf8)',
          sectionBg: 'var(--tg-theme-section-bg-color, #161f30)',
          sectionHeader: 'var(--tg-theme-section-header-text-color, #64748b)',
          subtitle: 'var(--tg-theme-subtitle-text-color, #94a3b8)',
          destructive: 'var(--tg-theme-destructive-text-color, #ef4444)'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      animation: {
        'scan': 'scan 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
