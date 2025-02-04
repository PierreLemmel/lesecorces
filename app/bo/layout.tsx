import MainMenu from '../../components/layout/main-menu';
import { mergeClasses } from '../../lib/utils';
import '../globals.css'

type RootLayoutProps = {
	children: React.ReactNode
}

export default function RootLayout(props: RootLayoutProps) {

	const { children } = props;

	return <body className={mergeClasses(
		"w-screen h-screen overflow-x-hidden",
		"font-red-hat-display bg-black text-golden",
		"p-5"
	)}>
		{children}
	</body>
}