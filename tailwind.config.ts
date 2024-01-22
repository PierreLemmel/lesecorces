import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
