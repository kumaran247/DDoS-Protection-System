/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#050816',
          dark: '#0F172A',
          purple: '#7C3AED',
          cyan: '#06B6D4',
        },
      },
      boxShadow: {
        neon: '0 0 20px rgba(124, 58, 237, 0.3)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};
