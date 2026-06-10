/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1A2F',
          50: '#F5F7FA',
          100: '#E6ECF3',
          200: '#C2CFE0',
          700: '#1E3A5F',
          800: '#13243F',
          900: '#0A1A2F',
          950: '#05101F',
        },
        gold: {
          DEFAULT: '#B8945F',
          light: '#D4B57F',
          dark: '#8F6F40',
        },
        cream: '#FBF9F4',
        rule: '#E6DFD2',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Source Serif Pro"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        wider2: '0.18em',
      },
      maxWidth: {
        prose2: '68ch',
      },
    },
  },
  plugins: [],
}
