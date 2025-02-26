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
    },
  },
}

export default config