const ottoiaTheme = require('../../design-system/tailwind.config.ottoia');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...ottoiaTheme,
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Override plugins so require resolves from this project's node_modules
  plugins: [require("tailwindcss-animate")],
};
