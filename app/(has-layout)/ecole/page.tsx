import { faArrowTurnDown, faAtom, faEnvelope, faGem, faHand, faLeaf, faSeedling, faShieldHeart } from "@fortawesome/free-solid-svg-icons";
import { EcorcesIcon } from "../../../components/ui/icon";
import { groupBy, mergeClasses } from "../../../lib/utils";
import { EcorcesEcoleInfos, getActivites, getBlockContent, getEcoleInfos } from "../../../server/server"
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { EcoleFoldable } from "./ecole-foldable";
import StagesBlockContent from "./stages-block-content";
import Link from "next/link";

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
        "px-2 pt-[4.2rem] pb-2",
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
        "mt-12",
        "relative z-10"
    )}>
        

        <div className={mergeClasses(
            "border-t border-golden pt-2",
            "font-light"
        )}>
            {valeursDescription}
        </div>
        <div className={mergeClasses(
            "flex flex-col",
            "gap-6 mt-6 px-4 mb-10"
        )}>
            {cards.map((card, index) => {
                return <ValeursCard key={`Valeurs-${index.toString().padStart(2, "0")}`} {...card} />
            })}
        </div>

        <div className={mergeClasses(
            "w-full h-full absolute inset-0",
            "bg-cover bg-center bg-no-repeat -z-10",
        )}
        style={{
            backgroundImage: "url(/img/qacda/qacda-03.jpeg)",
        }}
        >
            <div className="bg-black/70 w-full h-full"
            />
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

    const stages = await getActivites({
        type: "Stage",
        upcoming: true
    })

    const {
        "Lyon": stagesLyon,
        "Paris": stagesParis,
        "Autre": stagesAutres
    } = groupBy(stages, stage => stage.city);

    return <EcoleFoldable header={{
        icon: faLeaf,
        title: "Stages",
        description: headerDescription,
    }}
        className="border-t"
    >
        <StagesBlockContent
            stagesLyon={stagesLyon || []}
            stagesParis={stagesParis || []}
            stagesAutres={stagesAutres || []}
        />
    </EcoleFoldable>
}

const FacettesBlock = async () => {

    const headerDescription = await getBlockContent("ECOLE_FACETTES_FOLDABLE_HEADER")

    return <EcoleFoldable header={{
        icon: faGem,
        title: "Facettes",
        description: headerDescription,
    }}>
        <FacettesBlockContent />
    </EcoleFoldable>
}

const FacettesBlockContent = async () => {

    const ecoleHebdo = await getEcoleInfos("facettes");

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "gap-4"
    )}>
        <EcoleInfoGrid
            ecole={ecoleHebdo}
        />
    </div>
}

const CoursHebdoBlock = async () => {

    const headerDescription = await getBlockContent("ECOLE_COURS_HEBDO_FOLDABLE_HEADER")

    return <EcoleFoldable header={{
        icon: faSeedling,
        title: "Cours à l'année",
        description: headerDescription,
    }}>
        <CoursHebdoContent />
    </EcoleFoldable>
}

const CoursHebdoContent = async () => {

    const ecoleHebdo = await getEcoleInfos("hebdo");

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "gap-4"
    )}>
        <EcoleInfoGrid
            ecole={ecoleHebdo}
        />
    </div>
}

const ContactBlock = () => {    
    return <div className={mergeClasses(
        "flex flex-col items-center",
        "px-4 mt-8 mb-10"
    )}>
        <div className="heading-1">Contact</div>
        <div className="heading-2">Vous avez une question ?</div>

        <div className={mergeClasses(
                "w-[80%]",
                "flex flex-col items-center justify-around",
                "bg-golden/40",
                "p-4 mt-10"
            )}>

            <div className="text-xl font-semibold">Équipe pédagogique</div>
            <EcorcesIcon icon={faEnvelope} className="text-2xl my-5" />
            <div className="uppercase text-golden/40">Charles-Henri Botton</div>
            <Link href="mailto:lesecorces@gmail.com" className="text-white">
                lesecorces@gmail.com
            </Link>
        </div>
    </div>
}

type EcoleInfoProps = {
    ecole: EcorcesEcoleInfos;
}

const EcoleInfoGrid = (props: EcoleInfoProps) => {
    const {
        cities,
        frequency,
        days,
        hours,
        shows,
        price: [minPrice, maxPrice]
    } = props.ecole;

    const elements: [string, string|number][] = [
        ["Ville", cities],
        ["Fréquence", frequency],
        ["Jour", days],
        ["Heures", hours],
        ["Spectacles", shows],
        ["Tarifs", `${minPrice}€ - ${maxPrice}€`],
    ]

    return <div className={mergeClasses(
        "grid grid-cols-[auto_auto_auto] grid-cols columns-",
        "font-semibold",
        "p-4 gap-x-6 gap-y-2"
    )}>
        {elements.map(([label, value]) => {
            return <div key={label} className="flex flex-col">
                <div className="text-golden/40">{label}</div>
                <div className="font-semibold">{value}</div>
            </div>
        })}
    </div>
}

export default EcolePage;