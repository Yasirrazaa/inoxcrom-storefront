/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'spock-bold': ['SpockPro-Bold', 'sans-serif'],
        'spock-light': ['SpockPro-Light', 'sans-serif'],
      },
      colors: {
        'brand-blue': '#0093D0',
        'brand-text': '#3173A8',
        'brand-gray': '#4C4C4C',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
      },
    },
  },
  plugins: [],  // Temporarily removing the typography plugin until it's installed
}
