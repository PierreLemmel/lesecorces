/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: {
					100: '#EBBF99',
					200: '#E4AA77',
					300: '#DD9455',					
					400: '#D77F33',
					500: '#BC6C25',
					600: '#A15C20',
					700: '#864D1A',
					800: '#6B3D15',
					900: '#502E10',
				},
				secondary: {
					100: '#C3D9AA',
					200: '#A4C57F',
					300: '#86B254',
					400: '#678A3E',
					500: '#47602B',
					600: '#283618',
					700: '#222D14',
					800: '#1C2611',
					900: '#161E0E',
				},
			}
		},
	},
	plugins: [],
}
