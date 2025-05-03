/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'in': 'in 0.3s ease-out forwards',
        'fade-in-50': 'fade-in-50 0.3s ease-out forwards',
      },
      keyframes: {
        'in': {
          '0%': { transform: 'translateY(8px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in-50': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};