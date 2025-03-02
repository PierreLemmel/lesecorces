import { ecorcesColor } from './components/ui/ecorces-ui'
import { Config } from 'tailwindcss';

const {
  golden,
  golden2,
  flower,
  water,
  trunk,
  leaves,
  bark,
} = ecorcesColor

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
        golden,
        golden2,
        flower,
        water,
        trunk,
        leaves,
        bark
      },
      backgroundImage: {
        'feathering-landscape': 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 23%, rgba(0,0,0,0) 77%, rgba(0,0,0,0) 100%)'
      }
    },
  },
}

export default config