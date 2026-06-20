/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9', // Tailwind sky-500
        secondary: '#14b8a6', // Tailwind teal-500
      }
    },
  },
  plugins: [],
}
