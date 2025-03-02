import { faArrowTurnDown, faFire, faLeaf, faLink, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { EcorcesIcon } from "../../../components/ui/icon";
import { groupBy, mergeClasses } from "../../../lib/utils";
import { EcorcesActivite, getActivites, getBlockContent } from "../../../server/server";
import { Footer } from "../../../components/layout/footer";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ActiviteCard } from "../../../components/parts/activite-card";
import MainMenu from "../../../components/layout/main-menu";

const ContactPage = () => {

    return <div className="w-full min-h-screen flex flex-col bg-bark text-golden">

        <MainMenu />

        <HeaderBlock />

        <ActualitesBlock />

        <Footer />
    </div>
}

const HeaderBlock = async () => {

    const headerContent = await getBlockContent("ACTUALITES_HEADER");

    return <div className={mergeClasses(
        "flex items-stretch",
        "flex-col justify-between",
        "md:flex-row",
        "pt-[4.2rem] pb-2",
        "px-2 sm:px-6 md:px-12"
    )}>
        <div className={mergeClasses(
            "flex flex-col items-stretch",
        )}>
            <div className="text-white">Actualités</div>
            <div className="uppercase font-semibold">{headerContent}</div>
        </div>
        <EcorcesIcon icon={faArrowTurnDown} className={mergeClasses(
            "text-2xl md:text-3xl",
            "mt-4 mr-6",
        )} />
    </div>
}

const ActualitesBlock = async () => {

    const [
        activites,
        noSpectacle,
        noStage,
        noAutre,
    ] = await Promise.all([
        getActivites({
            visible: true,
            upcoming: true,
        }),
        getBlockContent("ACTUALITES_NO_SPECTACLE"),
        getBlockContent("ACTUALITES_NO_STAGE"),
        getBlockContent("ACTUALITES_NO_AUTRE"),
    ]);

    const grouped = groupBy(activites, activite => activite.type);
    
    const {
        "Spectacle": spectacles,
        "Stage": stages,
        "Actualité": autres,
    } = grouped;

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "gap-6",
        "pt-3 mt-8 mb-8",
        "px-0 sm:px-6 md:px-12",
        "border-t border-golden",
    )}>
        <ActualitesSubBlock
            title="Spectacles"
            activites={spectacles}
            icon={faFire}
            nothingToDisplay={noSpectacle}
        />
        <ActualitesSubBlock
            title="Stages"
            activites={stages}
            icon={faLeaf}
            nothingToDisplay={noStage}
        />
        {autres && <ActualitesSubBlock
            title="Autres"
            activites={autres}
            icon={faNewspaper}
            nothingToDisplay={noAutre}
        />}
    </div>
}

type SubblockProps = {
    title: string;
    activites: EcorcesActivite[]|undefined;
    icon: IconProp;
    nothingToDisplay: string;
}

const ActualitesSubBlock = (props: SubblockProps) => {
    const {
        title,
        activites,
        icon,
        nothingToDisplay
    } = props;

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "gap-2"
    )}
    >
        <div className={mergeClasses(
            "flex flex-row items-center",
            "px-4 gap-3"
        )}>
            <EcorcesIcon icon={icon} className="text-xl" />
            <div className="text-2xl font-semibold">{title}</div>
        </div>

        {activites ?
            <div className={mergeClasses(
                "grid",
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                "gap-2"
            )}>
                {activites.map((activite, index) => <ActiviteCard
                    key={`activite-${index.toString().padStart(2, "0")}`}
                    activite={activite}
                />)}
            </div>: 
            
            <div className="px-3 text-white">{nothingToDisplay}</div>}
    </div>
}

export default ContactPage;