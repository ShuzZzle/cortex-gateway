const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: "jit",
  purge: ["src/**/*.{tsx?,html,css?}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    },
  },
  variants: {},
  plugins: [],
}
