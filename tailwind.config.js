/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/pages/**/*.{js,ts,jsx,tsx}",
    "src/components/**/*.{js,ts,jsx,tsx}",
    "components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend:   {    
      colors: {
      primary: '#3fa476',  // rgb(63, 164, 118) green
      secondary: '#B81D33', // rgb(184, 29, 51) red
      accent: '#074d0f',    // rgb(7, 77, 15) bold green
      background: '#FFFFFF', // rgb(255, 255, 255) white
      forGrey: '#7b8db0' //grey
    },
  }
  },
  plugins: [],
}
