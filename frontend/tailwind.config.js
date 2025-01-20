/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          900: '#4C1D95',
          800: '#5B21B6',
          500: '#8B5CF6',
          300: '#A78BFA',
          100: '#EDE9FE',
        }
      }
    },
  },
  plugins: [],
}

