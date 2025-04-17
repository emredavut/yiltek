/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff1f1",
          100: "#ffe1e1",
          200: "#ffc7c7",
          300: "#ffa3a3",
          400: "#ff7373",
          500: "#ff3f3f",
          600: "#e61919",
          700: "#c11414",
          800: "#9f1414",
          900: "#841818",
          950: "#480707",
        },
      },
    },
  },
  plugins: [],
};
