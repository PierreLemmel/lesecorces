import { mergeClasses } from '../../lib/utils';

type EcorcesLayoutProps = {
	children: React.ReactNode
}

export default function EcorcesLayout(props: EcorcesLayoutProps) {

	const { children } = props;

	return <body className={mergeClasses(
		"w-screen h-screen overflow-x-hidden",
		"text-golden font-red-hat-display",
		"bg-black"
	)}>	
		{children}
	</body>
}