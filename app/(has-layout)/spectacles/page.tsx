import { faArrowTurnDown } from "@fortawesome/free-solid-svg-icons";
import { Footer } from "../../../components/layout/footer";
import { EcorcesIcon } from "../../../components/ui/icon";
import { mergeClasses } from "../../../lib/utils";
import { getBlockContent } from "../../../server/server";
import { TextLink } from "../../../components/ui/text-link";
import { EcorcesSpectacle, getSpectacle, getSpectacleIndex } from "../../../server/spectacles";
import { SpectacleCard } from "./spectacle-card";

const ShowsPage = async () => {

    const names = await getSpectacleIndex();

    const spectacles = await Promise.all(names.map(getSpectacle));

    const props: WithSpectaclesProps = { spectacles}

    return <div className="w-full min-h-screen flex flex-col bg-flower text-golden">
    
        <IntroBlock />

        <SpectaclesBlock {...props} />

        <QuiNousSommesBlock />
        <ProBlock />
        <BilletReducBlock {...props} />

        <Footer />
    </div>
}

type WithSpectaclesProps = {
    spectacles: EcorcesSpectacle[]
}

const IntroBlock = async () => {

    const intro = await getBlockContent("SPECTACLES_INTRO");

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "px-2 pb-6 pt-[4.2rem]"
    )}>
        <div className="text-white">Spectacles</div>
        <div className="uppercase font-semibold text-lg">{intro}</div>
        <EcorcesIcon icon={faArrowTurnDown} className="text-2xl mt-2" />
    </div>
}

const SpectaclesBlock = async (props: WithSpectaclesProps) => {
    
    const { spectacles } = props;

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "gap-2"
    )}>
        {spectacles.map((spectacle, index) => <SpectacleCard
            key={`SpectacleCard-${index.toString().padStart(2, "0")}`}
            spectacle={spectacle}
        />)}
    </div>
}

const QuiNousSommesBlock = async () => {
    
    const text =  await getBlockContent("SPECTACLES_QUI_NOUS_SOMMES");

    return <div className={mergeClasses(
        "flex flex-col items-center justify-center",
        "aspect-square min-h-[calc(100vh,100vw)] min-w-[calc(100vh,100vw)]",
        "border-t border-golden",
        "bg-cover bg-center bg-no-repeat",
        "bg-blend-multiply bg-gradient-to-b from-black/50 via-black/50 to-black/10",
        "px-5"
    )} style={{
        backgroundImage: [
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.35) 40%, rgba(0, 0, 0, 0.8) 90%, rgba(0, 0, 0, 0.92) 100%)",
            "url('/img/misc/qui-sommes-nous.jpg')"
        ].join(", ")
    }}>
        <div className="text-2xl uppercase font-bold text-center">Qui nous sommes</div>
        <div className="text-white font-semibold text-xl text-center">{text}</div>
        <TextLink href="/compagnie" className="mt-10">Compagnie</TextLink>
    </div>
}

const ProBlock = async () => {
    
    const [
        pro01,
        pro02
    ] = await Promise.all([
        getBlockContent("SPECTACLES_PRO_01"),
        getBlockContent("SPECTACLES_PRO_02"),
    ])

    return <div className={mergeClasses(
        "flex flex-col items-center",
        "px-2 pt-10",
        "border-t border-golden",
    )}>
        <div className={mergeClasses(
            "h-36 w-full",
            "bg-contain bg-center bg-no-repeat",
            "relative",
            "mb-8",
        )} style={{
            backgroundImage: "url('/img/misc/old-logo-white.png')"
        }}>
            <div className={mergeClasses(
                "absolute inset-0",
                "bg-golden mix-blend-multiply"
            )}/>
        </div>
        <div className="w-full text-2xl uppercase font-semibold text-center">{pro01}</div>
        <div className="w-full text-lg text-center text-white font-semibold">{pro02}</div>

        <TextLink href="/espace-pro" className="mt-6 mb-14">
            Espace professionnels
        </TextLink>
    </div>
}

const BilletReducBlock = async (props: WithSpectaclesProps) => {
    
    const { spectacles } = props;
    const br = await getBlockContent("SPECTACLES_BILLETREDUC");

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "px-2"
    )}>
        <div className="text-right font-semibold text-lg">Voir les avis</div>
        <div className={mergeClasses(
            "h-8",
            "bg-right bg-no-repeat bg-contain",
        )} style={{
            backgroundImage: "url('/img/misc/billet-reduc.png')"
        }}></div>
        <div className="text-right mt-1 text-golden/70">{br}</div>
    </div>
}

export default ShowsPage;