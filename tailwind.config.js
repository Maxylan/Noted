/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

module.exports = {
  content: ['./src/**/*.ts', './src/**/*.jsx', './src/**/*.tsx'],
  theme: {
    screens: { /*
      sm: '480px', */
      md: '768px', /*
      lg: '976px',
      xl: '1440px', */
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'text': 'rgb(80, 69, 56)',
        'primary': 'rgb(250, 226, 198)',
        'secondary': 'rgb(255, 213, 178)',
        'third': 'rgb(255, 197, 167)',
        'highlight': 'rgb(255, 179, 168)',
        'scrap': 'rgb(244 63 94)',
      },
    },
  },
  plugins: [],
}

