/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: '"Roboto", sans-serif',
        acme: '"Acme", sans-serif',
      },
      colors: {
        customGreen: "#cfead1",
        customDark: "rgba(34, 52, 76)",
        customPurple: "#6887c6",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilties = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      };

      addUtilities(newUtilties);
    },
  ],
};
