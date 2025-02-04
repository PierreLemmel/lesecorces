import React from "react";
import { Footer } from "../../components/layout/footer";
import { faNewspaper, faPhone, faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import { TextLink } from "../../components/ui/text-link";
import { mergeClasses } from "../../lib/utils";
import { EcorcesIcon } from "../../components/ui/icon";
import { proRessources } from "../../lib/res";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ActivitesBlock } from "../../components/homepage/activites";
import { NewsLetterBlock } from "../../components/homepage/newsletter-block";
import { OffresPedagogiqueBlock } from "../../components/homepage/offre-pedagogique-block";

const Home = () => {
  	return <div className="w-full min-h-screen flex flex-col bg-black text-golden">
		<Header />

		<ActivitesBlock />
		<OffresPedagogiqueBlock />
		<NewsLetterBlock />
		<CompagnieBlock />
		<EspaceProBlock />

		<Footer />
	</div>
}

const Header = () => <div className="w-full flex flex-col items-stretch pt-[1rem]">
	<div className="h-[15rem] relative overflow-hidden">
		<video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover" src="/videos/qacda-teaser.mp4" />
		<div className="absolute -top-1 inset-0 h-[2.5rem] bg-gradient-to-b from-black to-transparent"></div>
	</div>
</div>





const CompagnieBlock = () => <div className={mergeClasses(
	"pt-12 pb-16 px-2",
	"relative flex flex-row gap-4"
)}>
	<div className={mergeClasses(
		"flex flex-col items-stretch",
		"z-10"
	)}>
		<div className={mergeClasses(
			"heading-1 text-golden",
			"text-center"
		)}>
			Notre Compagnie
		</div>
		<div className={mergeClasses(
			"heading-2 text-white",
			"text-center"
		)}>
			Pourquoi Écorcés ?
		</div>
		<div className={mergeClasses(
			"mt-12 mb-4",
			"text-white font-light",
			"text-right"
		)}>
			Car sous l&apos;écorce d&apos;un arbre se cache un bois brut. Sous nos masques et ses failles nous aimons toucher à une mise à nue scénique, vulnérable et onirique. Notre compagnie puise aussi ses racines dans nos engagements sociaux, féministes et en constante réflexion sur les rapport de pouvoir et nos corps politiques et sexués. Nos spectacles veulent créer un rapport direct avec le public : porter son histoire sur scène. Nous avons à cœur de mettre l&apos;accent sur notre rapport à la création lumière, à notre engagement physique dans nos spectacles et à l&apos;hybridation des formes artistiques.
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
		"background-cover bg-top bg-no-repeat",
		"filter blur-[3px] saturate-[0.7] opacity-60 sepia-[0.2]"
	)} style={{
		backgroundImage: "url(/img/qacda/qacda-01.jpeg)",
	}}></div>
</div>

const EspaceProBlock = () => <div className={mergeClasses(
	"flex flex-col items-stretch",
	"gap-1 mt-8",
	"bg-no-repeat bg-[size:auto_200%] bg-[position:100%_20%]"
)}  style={{
	backgroundImage: "url(/img/misc/homepage-pro-bg.png)"
}}>
	<div className="heading-1 text-golden text-center">
		Vous êtes professionnel-le ?
	</div>
	<div className="heading-2 text-white text-center">
		Accédez à nos outils de diffusion
	</div>
	<div className={mergeClasses(
		"flex flex-row flex-wrap items-stretch justify-center",
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
		"bg-golden/15 gap-2 px-[10%]",
		"aspect-square min-w-full"
	)}>
		<EcorcesIcon icon={icon} className="bg-black text-white text-xl p-2" />
		<div className="heading-2 text-white">{title}</div>
		<div className="text-center text-white pt-3 pb-4">{text}</div>
		<TextLink
			href={actionHref}
		>
			{actionString}
		</TextLink>
	</div>
}

export default Home;