/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js" // Include Flowbite components
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        primary: "#1B4D99",
        secondary: "#fb923c"
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        }
      }
    },
  },
  plugins: [
    flowbitePlugin // Use the imported plugin
  ],
};
