module.exports = {
  purge: ['./pages/**/*.tsx', './components/**/*.tsx','./pages/**/*.ts', './components/**/*.ts' ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "primary": "#020887",
        "accent": "#EC058E",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
