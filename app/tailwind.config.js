/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        landing: "url('../public/landingPage.svg')",
        backgroundImage: "url('../public/bgImage.svg')",
        cardTexture: "url('../public/card_pattern.svg')",
      },
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
      },
      colors: {
        'serenity-pink': '#DC8782',
        'serenity-secondary': '#5B969C',
        'serenity-pink-secondary': '#FFE2E0',
      },
    },
  },
  plugins: [],
};
