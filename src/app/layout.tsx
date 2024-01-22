import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { mergeClasses } from '@/lib/utils'
import MainMenu from '@/components/layout/main-menu'
import { env } from 'process'
import Maintenance from '@/components/layout/maintenance'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Les Écorcés',
	description: 'Les Écorcés - Théâtre Improvisé',
}

type RootLayoutProps = {
	children: React.ReactNode
}

export default function RootLayout(props: RootLayoutProps) {

	const { children } = props;

	const maintenance = env.MAINTENANCE === 'true';

	return <html lang="fr">
		<body className={mergeClasses(
			inter.className,
			"flex flex-col items-stretch justify-evenly gap-3 min-h-screen",
			"bg-slate-500"
		)}>
			{maintenance ? 
			<Maintenance /> :
			<>
				<MainMenu />
				<div className="flex-grow relative">
					{children}
				</div>
			</>
			}
		</body>
	</html>
}