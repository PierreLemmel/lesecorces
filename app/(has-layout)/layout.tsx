import '../globals.css'
import MainMenu from '../../components/layout/main-menu'
import { mergeClasses } from '../../lib/utils'


type RootLayoutProps = {
	children: React.ReactNode
}

export default function RootLayout(props: RootLayoutProps) {

	const { children } = props;

	return <body className={mergeClasses(
		"flex flex-col items-stretch justify-evenly gap-3 min-h-screen",
		"bg-slate-500"
	)}>
		<MainMenu />
		<div className="flex-grow relative">
			{children}
		</div>
	</body>
}