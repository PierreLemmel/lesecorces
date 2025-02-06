import { faArrowTurnDown, faAtom, faHand, faLeaf, faShieldHeart } from "@fortawesome/free-solid-svg-icons";
import { EcorcesIcon } from "../../../components/ui/icon";
import { mergeClasses } from "../../../lib/utils";
import { getBlockContent } from "../../../server/server"
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import EcorcesFoldable from "../../../components/ui/ecorces-foldable";
import { EcoleFoldable } from "./ecole-foldable";

const EcolePage = () => {

    return <div className="w-full min-h-screen flex flex-col bg-black text-golden">

        <HeaderBlock />

        <ValeursBlock />

        <StagesBlock />
        <FacettesBlock />
        <CoursHebdoBlock />

        <ContactBlock />
    </div>
}


const HeaderBlock = async () => {

    const headerContent = await getBlockContent("ECOLE_HEADER");

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "px-2 pt-[4.2rem]",
    )}>
        <div className="text-white">Pédagogie</div>
        <div className="uppercase font-semibold">{headerContent}</div>
        <EcorcesIcon icon={faArrowTurnDown} className="mt-4 text-2xl" />
    </div>
}

const ValeursBlock = async () => {

    const valeursDescription = await getBlockContent("ECOLE_DESCRIPTION");

    const niveauCardText = await getBlockContent("ECOLE_NIVEAU_CARD");
    const valeursCardText = await getBlockContent("ECOLE_VALEURS_CARD");
    const consentementCardText = await getBlockContent("ECOLE_CONSENTEMENT_CARD");
    
    const cards = [
        {
            title: "Niveaux",
            icon: faAtom,
            description: niveauCardText
        },
        {
            title: "Valeurs",
            icon: faShieldHeart,
            description: valeursCardText
        },
        {
            title: "Consentement",
            icon: faHand,
            description: consentementCardText
        }
    ]

    return <div className={mergeClasses(
        "flex flex-col items-stretch px-2",
        "mt-12"
    )}>
        <div className={mergeClasses(
            "border-t border-golden pt-2",
            "font-light"
        )}>
            {valeursDescription}
        </div>
        <div className={mergeClasses(
            "flex flex-col",
            "gap-6 mt-6 px-4"
        )}>
            {cards.map((card, index) => {
                return <ValeursCard key={`Valeurs-${index.toString().padStart(2, "0")}`} {...card} />
            })}
        </div>
    </div>
}

type ValeursCardProps = {
    title: string;
    icon: IconProp;
    description: string;
}

const ValeursCard = (props: ValeursCardProps) => {
    const {
        title,
        icon,
        description
    } = props;

    return <div className={mergeClasses(
        "flex flex-col items-center justify-center",
        "aspect-square",
        "bg-golden/40",
        "py-4 px-6 gap-5"
    )}>
        <div className="text-2xl font-semibold">{title}</div>
        <EcorcesIcon icon={icon} className="text-4xl" />
        <div className="text-white text-center mt-4">{description}</div>
    </div>
}

const StagesBlock = async () => {
    
    const headerDescription = await getBlockContent("ECOLE_STAGE_FOLDABLE_HEADER")

    return <EcoleFoldable header={{
        icon: faLeaf,
        title: "Stages",
        description: headerDescription,
    }}>
        <div>Stages à Lyon</div>
        <div>Stages à Paris</div>
        <div>Stages ailleurs</div>
    </EcoleFoldable>
}

const FacettesBlock = () => {
    return <div>FACETTES</div>
}

const CoursHebdoBlock = () => {
    return <div>COURS HEBDO</div>
}

const ContactBlock = () => {    
    return <div>CONTACT</div>
}

export default EcolePage;