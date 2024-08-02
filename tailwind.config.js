/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-light": "#6e9df7",
        "primary-dark": "#335467",
        "border-light": "#6e9df7",
        "border-dark": "#335467",
        "light-text": "#000000",
        "dark-text": "#ffffff",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
