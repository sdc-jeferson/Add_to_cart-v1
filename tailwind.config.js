/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      oswald: ["Oswald", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        "gray-90": "#e5e5e5",
        'marrom': "#333333",
        'modal': "#d3d3d3",
      },
    },
  },
  plugins: [],
};
