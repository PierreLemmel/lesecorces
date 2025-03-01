"use client";

import EcorcesTabComponent from "../../../components/ui/ecorces-tab-component";
import { layoutClasses, uiBreakPoints } from "../../../components/ui/ecorces-ui";
import { TextLink } from "../../../components/ui/text-link";
import { useWindowSize } from "../../../lib/hooks";
import { mergeClasses } from "../../../lib/utils";

export type OffresPedagogiqueBlockContentProps = {
    tabs: {
        title: string,
        content: string
    }[],
    offrePedaText: string
}

export const OffresPedagogiqueBlockContent = (props: OffresPedagogiqueBlockContentProps) => {

    const {
        tabs,
        offrePedaText
    } = props;

    const { width } = useWindowSize();

	return <div className={mergeClasses(
		"flex flex-col items-center gap-3",
		"pb-8 mb-8",
		"relative z-20",
		"md:mt-10"
	)}>
		<div className={mergeClasses(
			"flex flex-col items-stretch gap-3",
			"md:w-[80%] lg:w-[70%] xl:w-[60%]",
			"gap-3",
		)}>

			<div className={mergeClasses(
				"absolute inset-0",
				"bg-no-repeat",
				"bg-[100%_auto] bg-top",
				"md:bg-[50%_23%] md:bg-cover",
				"bg-[url(/img/qacda/qacda-02.jpeg)]",
				"-z-10"
			)}>
				<div className={mergeClasses(
					"w-full h-full",
					"bg-gradient-to-r md:bg-gradient-to-b",
					"from-black/80 via-black/50 to-black/80"
				)} />
			</div>

			<div className={mergeClasses(
				"heading-1 text-golden",
				"text-center",
			)}>
				Nos offres pédagogiques
			</div>
			<div className="text-white text-center">
				{offrePedaText}
			</div>

			<div className={mergeClasses(
				"flex flex-col items-center",
				layoutClasses.mainColumnPadding,
			)}>
				<EcorcesTabComponent
					className=""
					tabPosition={width > uiBreakPoints.md ? "Right" : "Top" }
					tabs={tabs}
				/>
			</div>
			
			<TextLink href="/ecole" className="text-center underline">
				Voir nos offres pédagogiques
			</TextLink>
		
		</div>
	</div>;
}