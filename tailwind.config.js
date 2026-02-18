/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'risk-yellow': '#FFC107',
        'risk-orange': '#FF9800',
        'risk-red': '#F44336',
      }
    },
  },
  plugins: [],
}
