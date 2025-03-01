import React from "react";
import { faNewspaper, faPhone, faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import { TextLink } from "../../../components/ui/text-link";
import { mergeClasses } from "../../../lib/utils";
import { EcorcesIcon } from "../../../components/ui/icon";
import { proRessources } from "../../../lib/res";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { getActivites, getBlockContent, getOffrePedagogique } from "../../../server/server";
import EcorcesTabComponent from "../../../components/ui/ecorces-tab-component";
import { NewsLetter } from "../../../components/ui/newsletter";
import { Footer } from "../../../components/layout/footer";
import MainMenu from "../../../components/layout/main-menu";
import { layoutClasses } from "../../../components/ui/ecorces-ui";
import { ActivitesGridDisplay } from "../../../components/parts/activites-grid-display";
import { OffresPedagogiqueBlockContent } from "./client-component";

const Home = () => {

	return <div className="w-full min-h-screen flex flex-col bg-black text-golden">
		
		<MainMenu shadow={true} floating={true} />
		
		<Header />

		<ActivitesBlock />
		<OffresPedagogiqueBlock />
		<NewsLetterBlock />
		<CompagnieBlock />
		<EspaceProBlock />

		<Footer />
	</div>
}

const Header = () => <div className={mergeClasses(
	"w-full flex flex-col items-stretch",
	"pt-[1rem] md:pt-0"
)}>
	<div className={mergeClasses(
		"relative overflow-hidden",
		"h-[15rem] md:h-[30rem]"
	)}>
		<video
			autoPlay muted loop
			className={mergeClasses(
				"absolute top-0 left-0 w-full h-full object-cover",
				"bg-cover bg-[50%_86%] bg-no-repeat bg-[url(/img/misc/homepage-video-fallback.jpeg)]",
				
			)}
			src="/videos/qacda-teaser.mp4"
		/>
		<div className={mergeClasses(
			"absolute -top-1 inset-0 bg-gradient-to-b from-black to-transparent",
			"h-[2.5rem] md:h-[10.6rem]"
		 )} />
		
	</div>
</div>


const ActivitesBlock = async () => {

    const activites = await getActivites({
        upcoming: true,
        visible: true,
        limit: 6
    });

    return <div className={mergeClasses(
        "grid",
		"grid-rows-[auto,auto,auto] md:grid-rows-[auto,auto]",
		"grid-cols-1 md:grid-cols-2",
		layoutClasses.mainColumnPadding,
        "mb-12 mt-8 md:mt-12"
    )}>
        <div className={mergeClasses(
			layoutClasses.heading1,
			"md:justify-self-start",
			"md:pl-6"
		)}>
			Nos prochaines activités
		</div>
        
        <ActivitesGridDisplay
            activites={activites}
            className={mergeClasses(
				"mb-4 mt-2",
				"row-start-2 md:col-span-2"
			)}
        />
        
        <div className={mergeClasses(
			"md:justify-self-end",
			"md:pr-12"
		)}>
			<TextLink href="/actualites" className="underline">Tout voir</TextLink>
		</div>
    </div>
}

const OffresPedagogiqueBlock = async () => {

	const [
		offrePedaText,
		offrePeda
	] = await Promise.all([
		getBlockContent("HOMEPAGE_OFFRE_PEDA"),
		getOffrePedagogique()
	]);

	const tabs = offrePeda.map(offre => ({
		title: offre.name,
		content: offre.description
	}));

	return <OffresPedagogiqueBlockContent
		{...{offrePedaText, tabs}}
	/>
}


const CompagnieBlock = async () => {

	const compagnieDescription = await getBlockContent("HOMEPAGE_COMPAGNIE");

	return <div className={mergeClasses(
		"pt-12 pb-16 px-2",
		"relative flex flex-row gap-4"
	)}>
		<div className={mergeClasses(
			"flex flex-col justify-center",
			"items-stretch md:items-end",
			"md:w-1/2",
			"md:pl-[16.66%]",
			"z-10"
		)}>
			<div className={mergeClasses(
				layoutClasses.heading1,
				"text-golden",
				"text-center"
			)}>
				Notre Compagnie
			</div>
			<div className={mergeClasses(
				layoutClasses.heading2,
				"text-white",
				"text-center"
			)}>
				Pourquoi Écorcés ?
			</div>
			<div className={mergeClasses(
				"mt-12 mb-4",
				"text-white font-light",
				"text-right"
			)}>
				{compagnieDescription}
			</div>
			<div className="flex flex-row justify-end mt-4">
				<TextLink
					href="/compagnie"
					className={mergeClasses(
						"pt-3 text-right",
						"border-t border-golden"
					)}
				>
					Page de notre compagnie
				</TextLink>
			</div>
		</div>

		<div className={mergeClasses(
			"absolute w-full h-full top-0 left-0",
			"left-0 md:left-[55%]",
			"w-full md:w-[28.33%]",
			"bg-cover bg-[50%_15%] bg-no-repeat",
			"filter saturate-[0.7] opacity-60 sepia-[0.2]",
			"blur-[3px] md:blur-none"
		)} style={{
			backgroundImage: "url(/img/qacda/qacda-01.jpeg)",
		}}></div>
	</div>;
}

const EspaceProBlock = () => <div className={mergeClasses(
	"flex flex-col items-stretch",
	"gap-1 mt-8",
	"bg-no-repeat bg-[size:auto_200%] bg-[position:100%_20%]",
	"bg-[url(/img/misc/homepage-pro-bg.png)]",
	"pt-2 md:pt-8",
	"pb-6 md:pb-10"
)}>
	<div className={mergeClasses(
		layoutClasses.heading1,
		"text-golden text-center"
	)}>
		Vous êtes professionnel-le ?
	</div>
	<div className={mergeClasses(
		layoutClasses.heading2,
		"text-white text-center"
	)}>
		Accédez à nos outils de diffusion
	</div>
	<div className={mergeClasses(
		"flex items-stretch justify-center",
		"flex-col md:flex-row",
		"gap-7 px-7 py-6"
	)}>
		<EspaceProBlockCard
			icon={faPhone}
			title="Programmateur-ice"
			text="Accédez aux dossiers de diffusion de nos spectacles, ainsi qu'à nos coordonnées."
			actionString="Consulter"
			actionHref={proRessources.prog}
		/>
		<EspaceProBlockCard
			icon={faNewspaper}
			title="Presse"
			text="Consulter notre dossier de presse, ainsi que les différents articles et critiques de nos spectacles."
			actionString="Consulter"
			actionHref={proRessources.press}
		/>
		<EspaceProBlockCard
			icon={faPhotoFilm}
			title="Visuels et vidéos"
			text="Vous trouverez ici les visuels et vidéos de nos spectacles, ainsi que notre charte graphique."
			actionString="Consulter"
			actionHref={proRessources.visuels}
		/>
	</div>
</div>

type EspaceProBlockCardProps = {
	icon: IconProp;
	title: string;
	text: string;
	actionString: string;
	actionHref: string;
}

const EspaceProBlockCard = (props: EspaceProBlockCardProps) => {

	const {
		icon,
		title,
		text,
		actionString,
		actionHref
	} = props;

	return <div className={mergeClasses(
		"flex flex-col items-center justify-center",
		"bg-golden/15 gap-2 py-3",
		"aspect-square",
		layoutClasses.mainColumnPadding,
		"w-full md:w-[21rem] lg:w-[23rem]",
	)}>
		<EcorcesIcon icon={icon} className={mergeClasses(
			"bg-black text-white text-xl p-2"
		)} />
		<div className={mergeClasses(
			layoutClasses.heading2,
			"text-white"
		)}>{title}</div>
		<div className="text-center text-white pt-3 pb-4">{text}</div>
		<TextLink
			href={actionHref}
			target="_blank"
		>
			{actionString}
		</TextLink>
	</div>
}

const NewsLetterBlock = async () => {

	const [
		newsLetter01,
		newsLetter02,
		newsLetter03,
	] = await Promise.all([
		getBlockContent("HOMEPAGE_NEWSLETTER_01"),
		getBlockContent("HOMEPAGE_NEWSLETTER_02"),
		getBlockContent("HOMEPAGE_NEWSLETTER_03"),
	]);

	return <div className={mergeClasses(
		"flex flex-row items-stretch",
		layoutClasses.mainColumnPadding,
		"md:mb-8"
	)}>
		<div className={mergeClasses(
			"hidden md:flex",
			"w-1/2",
			"md:pl-[15%]",
		)}>
			<div className={mergeClasses(
				"h-full w-full",
				"bg-cover bg-left bg-no-repeat",
				"bg-[url(/img/qacda/qacda-06.jpeg)]",
			)}>
				<div className={mergeClasses(
					"w-full h-full",
					"bg-[linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_23%)]",
					"z-10"
				)}/>
			</div>
		</div>

		<div className={mergeClasses(
			"flex flex-col items-stretch",
			"mb-8",
			"md:px-9 lg:px-12",
			"md:py-6"
		)}>
			<div className={mergeClasses(
				layoutClasses.heading1,
				"text-center"
			)}>
				{newsLetter01}
			</div>
			<div className={mergeClasses(
				layoutClasses.heading2,
				"text-center text-white"
			)}>
				{newsLetter02}
			</div>
			<div className="text-white mt-6 text-center">{newsLetter03}</div>

			<NewsLetter className="mt-4" />
		</div>
	</div>;
}

export default Home;