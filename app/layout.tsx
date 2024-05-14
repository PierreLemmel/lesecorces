import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Les Écorcés',
	description: 'Les Écorcés - Théâtre Improvisé',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <html lang="fr" className={inter.className}>
		{children}
	</html>
}