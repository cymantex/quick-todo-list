/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{scss,css,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["business", "autumn"],
  },
};
