import { faArrowTurnDown } from "@fortawesome/free-solid-svg-icons";
import { EcorcesIcon } from "../../../components/ui/icon";
import { mergeClasses } from "../../../lib/utils";
import { EcorcesMembre, getActivites, getBlockContent, getMembre } from "../../../server/server";
import { TextLink } from "../../../components/ui/text-link";
import { ActiviteCard } from "../../../components/parts/activite-card";

const CompagniePage = () => {

    return <div className="w-full min-h-screen flex flex-col bg-black text-golden">

        <HeaderBlock />

        <PresentationBlock />

        <ActualitesBlock />

        <MembresBlock />
        <AussiAvecNousBlock />
        <PartenairesBlock />

        <ContactBlock />
        
    </div>
}


const HeaderBlock = async () => {

    const headerContent = await getBlockContent("COMPAGNIE_HEADER");

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "px-2 pt-[4.2rem] pb-8",
    )}>
        <div className="text-white">Compagnie</div>
        <div className="uppercase font-semibold">{headerContent}</div>
        <EcorcesIcon icon={faArrowTurnDown} className="mt-4 text-2xl" />
    </div>
}


const PresentationBlock = async () => {

    const presentationContent = await getBlockContent("COMPAGNIE_PRESENTATION");
    const origineContent = await getBlockContent("COMPAGNIE_ORIGINES");
    const pourquoiEcorcesContent = await getBlockContent("COMPAGNIE_POURQUOI_ECORCES");

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "bg-cover bg-no-repeat bg-center",
        "bg-blend-multiply bg-black/60"
    )} style={{
        backgroundImage: "url(/img/qacda/qacda-04.jpeg)"
    }}>
        <div className={mergeClasses(
            "border-t border-golden",
            "px-2 pt-1 pb-4"
        )}>
            {presentationContent}
        </div>

        <div className={mergeClasses(
            "flex flex-col items-stretch",
            "border-t border-golden",
            "px-2 pt-2 pb-8 gap-2"
        )}>
            <div className="text-white font-semibold text-xl">Les origines</div>
            <div>{origineContent}</div>
        </div>

        <div className={mergeClasses(
            "flex flex-col items-stretch",
            "border-t border-golden",
            "px-2 pt-2 pb-8 gap-2"
        )}>
            <div className="text-white font-semibold">Pourquoi Écorcés ?</div>
            <div>{pourquoiEcorcesContent}</div>
        </div>
    </div>
}


const ActualitesBlock = async () => {

    const activites = await getActivites({
            upcoming: true,
            visible: true,
            limit: 3
        });
    
        return <div className={mergeClasses(
            "flex flex-col items-center",
            "mb-12 mt-8"
        )}>
            <div className="heading-1">Nos actualités</div>
            
            <div className="flex flex-col items-stretch gap-2 px-3 w-full mb-4 mt-2">
                {
                    activites.length > 0 ? activites.map((activite, index) => <ActiviteCard
                        activite={activite}
                        key={`Activity-${index.toString().padStart(2, " ")}`}
                    />) : <div className="text-white mt-4">
                        Aucune activité n&apos;est prévue pour l&apos;instant
                    </div>
                }
            </div>
            
            <div><TextLink href="/activites" className="underline">Tout voir</TextLink></div>
        </div>
}

const MembresBlock = async () => {

    const names = [
        "Alice Rey",
        "Pierre Lemmel",
        "Kenan Philbert-Zehani",
        "Charles-Henri Botton",
    ]

    const membres = await Promise.all(names.map(async (name) => {
        const membre = await getMembre(name);
        return membre;
    }));

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
    )}>
        {membres.map((membre, index) => <MembreCard
            membre={membre}
            key={`Membre-${index.toString().padStart(2, " ")}`}
        />)}
    </div>
}

type MembreCardProps = {
    membre: EcorcesMembre
}

const MembreCard = (props: MembreCardProps) => {
    const {
        membre
    } = props;

    return <div className={mergeClasses(
        "uppercase font-semibold",
    )}>
        {membre.name}
    </div>
}

const AussiAvecNousBlock = async () => {

    return <div>AUSSI AVEC NOUS</div>
}

const PartenairesBlock = async () => {
    return <div>PARTENAIRES</div>
}

const ContactBlock = async () => {
    return <div>CONTACT</div>
}

export default CompagniePage;