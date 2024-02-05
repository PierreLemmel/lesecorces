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
        'abril-fatface': ['AbrilFatface', 'sans-serif'],
        'arsenica': ['Arsenica', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config
