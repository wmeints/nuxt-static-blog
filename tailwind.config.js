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
  daisyui: {
    logs: false,
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],

};
