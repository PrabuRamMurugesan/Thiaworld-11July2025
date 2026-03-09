/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      animation: {
        marquee: 'marquee 35s linear infinite',
      },

      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },

      fontFamily: {
        luxury: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },

    },
  },
  plugins: [],
};