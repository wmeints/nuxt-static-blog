/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
    "./content/**/*.md",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
