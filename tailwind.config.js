/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}", // Include styles for all files
    "!./src/screens/**/*.{html,js}", // Exclude styles for files in src/screens
  ],
  theme: {
    
    extend: {
      colors: {
        customColor: '#282c34',
        customColor1: '#394359', // Example color, replace with your desired color code
      },
    },
  },
  plugins: [],
};
