import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'red-hat-display': ['RedHatDisplay', 'sans-serif'],
      },
      colors: {
        golden: '#F3BC77',
        flower: '#150808',
        water: '#081215',
        trunk: '#151108',
        leaves: '#0C1508'
      },
    },
  },
  plugins: [],
}
export default config
