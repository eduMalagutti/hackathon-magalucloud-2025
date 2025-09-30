/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mindaro': '#d9ed92',
        'light-green': '#b5e48c',
        'light-green-2': '#99d98c',
        'emerald': '#76c893',
        'keppel': '#52b69a',
        'verdigris': '#34a0a4',
        'bondi-blue': '#168aad',
        'cerulean': '#1a759f',
        'lapis-lazuli': '#1e6091',
        'indigo-dye': '#184e77',
      },
    },
  },
  plugins: [],
}

