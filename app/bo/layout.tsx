import MainMenu from '../../components/layout/main-menu';
import '../globals.css'

type RootLayoutProps = {
	children: React.ReactNode
}

export default function RootLayout(props: RootLayoutProps) {

	const { children } = props;

	return <body className="w-screen h-screen overflow-x-hidden font-red-hat-display bg-black text-golden">
		<MainMenu />
		{children}
	</body>
}