/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage : {
        "BgOverviews" : 'url("https://www.gameinformer.com/sites/default/files/styles/full/public/2021/05/20/99fb0779/montecarlo.jpg")',
      }
    },
  },
  plugins: [],
}