/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        futm: {
          950: "#1a0b2e",
          900: "#2d1155",
          800: "#3d1a6d",
          700: "#4c1d95",
          600: "#6d28d9",
          500: "#8b5cf6",
          400: "#a78bfa",
          300: "#c4b5fd",
        },
        gold: {
          DEFAULT: "#f5b301",
          light: "#ffd35c",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
