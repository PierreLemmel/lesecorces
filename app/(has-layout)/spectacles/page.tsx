import { faArrowTurnDown } from "@fortawesome/free-solid-svg-icons";
import { Footer } from "../../../components/layout/footer";
import { EcorcesIcon } from "../../../components/ui/icon";
import { isNullOrEmpty, mergeClasses, sequence } from "../../../lib/utils";
import { getBlockContent } from "../../../server/server";
import { TextLink } from "../../../components/ui/text-link";
import { EcorcesSpectacle, getSpectacle, getSpectacleIndex } from "../../../server/spectacles";
import { SpectacleCard } from "./spectacle-card";
import { backgroundUrl, croppedImageUrl, layoutClasses } from "../../../components/ui/ecorces-ui";
import Link from "next/link";
import MainMenu from "../../../components/layout/main-menu";

const ShowsPage = async () => {

    const names = await getSpectacleIndex();

    const spectacles = await Promise.all(names.map(getSpectacle));

    const props: WithSpectaclesProps = { spectacles}

    return <div className="w-full min-h-screen flex flex-col bg-flower text-golden">
    
        <MainMenu />

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
        "flex items-stretch",
        "flex-col justify-between",
        "md:flex-row",
        "pt-[4.2rem] pb-2 md:pb-4 lg:pb-6",
        "px-2 sm:px-6 md:px-12"
    )}>
        <div className={mergeClasses(
            "flex flex-col items-stretch",
        )}>
            <div className="text-white">Spectacles</div>
            <div className="uppercase font-semibold">{intro}</div>
        </div>
        <EcorcesIcon icon={faArrowTurnDown} className={mergeClasses(
            "text-2xl md:text-3xl",
            "mt-4 mr-6",
        )} />
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
        "aspect-square sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[22/9] xl:aspect-[36/10]",
        "bg-center sm:bg-[50%_15%] md:bg-[50%_19%] lg:bg-[50%_10%] xl:bg-[50%_8%]",
        "w-full",
        "border-t border-golden",
        "bg-cover bg-no-repeat",
        "bg-blend-multiply",
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
        "flex items-center",
        "flex-col lg:flex-row",
        "justify-center lg:justify-around",
        "px-2 pt-10",
        "border-t border-golden",
        "aspect-square sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[22/9] xl:aspect-[36/10]",
        "bg-[21%_40%] sm:bg-[50%_50%] md:bg-[50%_50%] lg:bg-[50%_50%] xl:bg-[50%_39%]",
        "border-t border-golden",
        "bg-cover bg-no-repeat",
        "bg-blend-multiply",
    )} style={{
        backgroundImage:[
            "url('/img/qacda/qacda-05.jpeg')",
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.8) 90%, rgba(0, 0, 0, 0.92) 100%)",
        ].join(", ")
    }}>
        <div className={mergeClasses(
            "size-[5.4rem] sm:size-[7rem] md:size-[8rem] lg:size-[12.5rem]",
            "bg-contain bg-center bg-no-repeat",
            "relative",
            "mb-8",
            "bg-[url('/img/misc/old-logo-golden.png')]"
        )} />
        
        <div className={mergeClasses(
            "flex flex-col items-center"
        )}>
            <div className="w-full text-2xl uppercase font-semibold text-center">{pro01}</div>
            <div className="w-full text-lg text-center text-white font-semibold">{pro02}</div>

            <TextLink href="/espace-pro" className="mt-6 mb-14">
                Espace professionnels
            </TextLink>
        </div>
    </div>
}

const BilletReducBlock = async (props: WithSpectaclesProps) => {
    
    const { spectacles } = props;
    const br = await getBlockContent("SPECTACLES_BILLETREDUC");

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        layoutClasses.mainColumnPadding,
        "mb-4 md:mb-6 lg:mb-8"
    )}>
        <div className="text-right font-semibold text-lg">Voir les avis</div>
        <div className={mergeClasses(
            "h-8",
            "bg-right bg-no-repeat bg-contain",
        )} style={{
            backgroundImage: "url('/img/misc/billet-reduc.png')"
        }}></div>
        <div className={mergeClasses(
            "text-right mt-1 text-golden/70",
            "mb-2 md:mb-3 lg:mb-4"
        )}>
            {br}
        </div>
        <div className={mergeClasses(
            "w-full",
            "grid",
            "grid-cols-[repeat(2,auto)] md:grid-cols-[repeat(3,auto)] lg:grid-cols-[repeat(4,auto)] xl:grid-cols-[repeat(6,auto)] 2xl:grid-cols-[repeat(8,auto)]",
            "gap-x-3 gap-y-3"
        )} style={{
            direction: "rtl"
        }}>
            {spectacles
                .filter(s => !isNullOrEmpty(s.socials.billetreduc))
                .map((spectacle, index) => {

                const {
                    name,
                    socials: {
                        billetreduc
                    },
                    affiche: {
                        url,
                        cropArea
                    }
                } = spectacle

                const croppedUrl = croppedImageUrl(url, cropArea);

                return <Link
                    key={`BR-${index}`}
                    href={billetreduc ?? ""}
                    target="_blank"
                >
                    <div key={`BilletReduc-${index}`} className={mergeClasses(
                        "relative",
                        "aspect-square w-full",
                        "bg-center bg-no-repeat bg-cover",
                        "hover:scale-[1.03] transition-transform"
                    )} style={{
                        backgroundImage: backgroundUrl(croppedUrl)
                    }}>
                        <div className={mergeClasses(
                            "absolute",
                            "bottom-1 left-1",
                            "text-white"
                        )}>
                            {name}
                        </div>
                    </div>
                </Link>;
            })}
        </div>
    </div>
}

export default ShowsPage;