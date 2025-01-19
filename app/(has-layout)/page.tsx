
import { Footer } from "../../components/layout/footer";
import MainMenu from "../../components/layout/main-menu";
import { mergeClasses } from "../../lib/utils";

const Home = () => {
  	return <div className="w-full min-h-screen flex flex-col bg-black text-golden">
		<Header />

		<ActivitesBlock />
		<OffresPedagogiqueBlock />
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

const ActivitesBlock = () => <div>
	NOS ACTIVITES
</div>

const OffresPedagogiqueBlock = () => {

	

	return <div>
		NOS OFFRES PEDAGOGIQUES
	</div>;
}

const CompagnieBlock = () => {

	return <div className={mergeClasses(
		"pt-12 pb-16 px-2",
		"relative flex flex-row gap-4"
	)}>
		<div className={mergeClasses(
			"flex flex-col items-stretch",
			"z-10"
		)}>
			<div className={mergeClasses(
				"uppercase font-extrabold text-xl",
				"text-center"
			)}>
				Notre Compagnie
			</div>
			<div className={mergeClasses(
				"text-white font-semibold",
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
		</div>
		<div className={mergeClasses(
			"absolute w-full h-full top-0 left-0 bg-red-400"
		)}></div>
	</div>;
}

const EspaceProBlock = () => <div>
	VOUS ÊTES PROFESSIONNELS
</div>



export default Home;