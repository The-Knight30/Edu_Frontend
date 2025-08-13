// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#0A48E0",
          700: "#0A2E87",
        },
        secondary: {
          500: "#65D6D6",
          700: "#00A5A5",
        },
        "gray-color": {
          500: "#494747",
          700: "#342E34",
        },
      },
    },
    fontFamily: {
      playfair: ["Playfair Display", "serif"],
      freehand: ["Freehand", "cursive"],
      Mukta: ["Mukta", "serif"]
    },
    container: {
      center: true,
      padding: '1rem', // Add padding to the container
    },
  },
  plugins: [],
  darkMode: "class",
};