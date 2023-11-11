/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}", // Include styles for all files
    "!./src/screens/**/*.{html,js}", // Exclude styles for files in src/screens
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
