/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/pages/**/*.{js,ts,jsx,tsx}",
    "src/components/**/*.{js,ts,jsx,tsx}",
    "components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f7eb',
          100: '#c8edd6',
          200: '#97e1b2',
          300: '#67d58f',
          400: '#3fcf76',
          500: '#3fa476',  // base color
          600: '#2f8059',
          700: '#20603d',
          800: '#123e24',
          900: '#091f12',
        },
        secondary: {
          50: '#fde0e4',
          100: '#fbbcc3',
          200: '#f68a95',
          300: '#f15b6b',
          400: '#ec334a',
          500: '#b81d33',  // base color
          600: '#911627',
          700: '#6b101b',
          800: '#470a10',
          900: '#280508',
        },
        accent: {
          50: '#e6f2e8',
          100: '#c1dcc6',
          200: '#9ac5a2',
          300: '#73ae7d',
          400: '#509c5e',
          500: '#074d0f',  // base color
          600: '#053b0b',
          700: '#042907',
          800: '#021803',
          900: '#010d01',
        },
        background: {
          DEFAULT: '#FFFFFF',  // base color
        },
        forGrey: {
          50: '#eef0f6',
          100: '#d4d7e3',
          200: '#b9c0d0',
          300: '#9da9be',
          400: '#8491aa',
          500: '#7b8db0',  // base color
          600: '#636e85',
          700: '#4a4f5a',
          800: '#303137',
          900: '#18191d',
        },
      },
    },
  },
  plugins: [],
}
