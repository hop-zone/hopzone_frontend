const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  // mode: 'jit',

  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],

  darkMode: 'media', // or 'class'

  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        theme: {
          orange: '#EE6F60',
          red: '#9F3F5B',
          lightpurple: '#7330A3',
          purple: '#492E9F',
          darkpurple: '#221A56',
        },
        purple: {
          200: '#f8f7fc',
          300: '#efedfa',
          400: '#dddaf2',
          500: '#c6bff2',
          600: '#9991cc',
          700: '#68609c',
          800: '#3a3170',
          900: '#221a56',
        },
      },
    },
  },

  variants: {
    extend: {},
  },

  plugins: [],
}
