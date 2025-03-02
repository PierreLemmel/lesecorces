import EcorcesLayout from '../../components/ui/ecorces-layout';
import '../globals.css'

type LayoutProps = {
	children: React.ReactNode
}

export default function RootLayout(props: LayoutProps) {
	const { children } = props;

	return <EcorcesLayout>{children}</EcorcesLayout>
}