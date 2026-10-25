/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0c1df2',
          hover: '#2434f5',
          light: '#4251f7',
          dark: '#0814aa',
          subtle: 'rgba(12, 29, 242, 0.12)',
          glow: 'rgba(12, 29, 242, 0.25)',
        },
        accent: {
          cyan: '#06b6d4',
          'cyan-hover': '#0891b2',
          'cyan-subtle': 'rgba(6, 182, 212, 0.12)',
        },
        surface: {
          base: '#020617',
          elevated: '#0f172a',
          panel: '#1e293b',
          card: 'rgba(15, 23, 42, 0.75)',
          overlay: 'rgba(2, 6, 23, 0.85)',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        cyber: {
          bg: '#0a0b10',
          card: '#121420',
          neonCyan: '#00f3ff',
          neonPink: '#ff007f',
          neonGreen: '#00ff66',
        },
      },
      borderRadius: {
        'app-sm': '0.375rem',
        'app-md': '0.5rem',
        'app-lg': '0.75rem',
        'app-xl': '1rem',
        'app-2xl': '1.5rem',
      },
      animation: {
        'ripple': 'ripple-wave 0.6s cubic-bezier(0, 0, 0.2, 1) forwards',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        'ripple-wave': {
          '0%': { transform: 'scale(0)', opacity: '0.55' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulseGlow': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};
