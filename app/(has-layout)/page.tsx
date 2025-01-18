import { Footer } from "../../components/layout/footer";
import MainMenu from "../../components/layout/main-menu";

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

const OffresPedagogiqueBlock = () => <div>
	NOS OFFRES PEDAGOGIQUES
</div>

const CompagnieBlock = () => <div>
	NOTRE COMPAGNIE
</div>

const EspaceProBlock = () => <div>
	VOUS ÊTES PROFESSIONNELS
</div>



export default Home;