import { faArrowTurnDown, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { EcorcesIcon } from "../../../components/ui/icon";
import { mergeClasses } from "../../../lib/utils";
import { getActivites, getBlockContent } from "../../../server/server";
import { TextLink } from "../../../components/ui/text-link";
import { ActiviteCard } from "../../../components/parts/activite-card";
import { EcorcesPartenaire, getAmi, getMembre, getPartenaires } from "../../../server/membres";
import { MembreCard } from "./membre-card";
import { backgroundUrl, croppedImageUrl } from "../../../components/ui/ecorces-ui";
import { faInstagram, faFacebook, faSoundcloud } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { Footer } from "../../../components/layout/footer";

const CompagniePage = () => {

    return <div className="w-full min-h-screen flex flex-col bg-water text-golden">

        <HeaderBlock />

        <PresentationBlock />

        <ActualitesBlock />

        <MembresBlock />
        <AussiAvecNousBlock />
        <PartenairesBlock />

        <ContactBlock />
        
        <Footer />
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

    const [
        presentationContent,
        origineContent,
        pourquoiEcorcesContent,
    ] = await Promise.all([
        getBlockContent("COMPAGNIE_PRESENTATION"),
        getBlockContent("COMPAGNIE_ORIGINES"),
        getBlockContent("COMPAGNIE_POURQUOI_ECORCES"),
    ])

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
        "mb-8 mt-8",
    )}>
        <div className="heading-1">Nos actualités</div>
        
        <div className={mergeClasses(
            "flex flex-col items-stretch w-full",
            "gap-2 px-3 mb-4 mt-2",
        )}>
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
        "gap-8 pt-6",
        "border-t border-golden"
    )}>
        {membres.map((membre, index) => <MembreCard
            membre={membre}
            key={`Membre-${index.toString().padStart(2, " ")}`}
        />)}
    </div>
}



const AussiAvecNousBlock = async () => {

    const names = [
        "Esperanza Cagigas",
        "Lionel Boucharlat",
        "Marie Michel",
    ]

    const amis = await Promise.all(names.map(async (name) => {
        const ami = await getAmi(name);
        return ami;
    }));

    const subtitle = await getBlockContent("COMPAGNIE_AUSSI_AVEC_NOUS");

    return <div className={mergeClasses(
       "flex flex-col items-stretch",
       "border-t border-golden",
       "px-4 pt-8"
    )}>
        <div className="text-center heading-1">Aussi avec nous</div>
        <div className="text-center heading-2 text-white">{subtitle}</div>
        <div className={mergeClasses(
            "flex flex-col items-stretch",
            "mt-10 gap-6"
        )}>
            {amis.map((ami, index) => {
                const {
                    name,
                    role,
                    socials: {
                        instagram,
                        facebook,
                        soundcloud,
                        website
                    },
                    projects,
                    profilePicture
                } = ami;

                const url = croppedImageUrl(profilePicture.url, profilePicture.cropArea);

                return <div
                    key={`Ami-${index.toString().padStart(2, " ")}`}
                    className={mergeClasses(
                        "flex flex-col items-stretch justify-center",
                        "aspect-square",
                        "px-4",
                        "bg-center bg-cover bg-no-repeat",
                        "bg-black/50 bg-blend-multiply",
                    )}
                    style={{
                        backgroundImage: backgroundUrl(url)
                    }}
                >
                    <div className="text-white font-bold leading-none text-3xl">{name}</div>
                    <div className="text-white text-lg">{role}</div>
                    <div className={mergeClasses(
                        "font-light text-golden/70",
                        "mt-24"
                    )}>
                        Spectacle
                    </div>
                    <div className="font-bold">{projects}</div>
                    <div className={mergeClasses(
                        "flex flex-row items-center justify-center",
                        "gap-4 mt-6",
                        "font-semibold text-golden/70"
                    )}>
                        {instagram && <Link href={instagram} target="_blank">
                            <EcorcesIcon icon={faInstagram} className={mergeClasses(
                                "text-4xl",
                                "hover:scale-105"
                            )} />
                        </Link>}
                        {facebook && <Link href={facebook} target="_blank">
                            <EcorcesIcon icon={faFacebook} className={mergeClasses(
                                "text-4xl",
                                "hover:scale-105"
                            )} />
                        </Link>}
                        {soundcloud && <Link href={soundcloud} target="_blank">
                            <EcorcesIcon icon={faSoundcloud} className={mergeClasses(
                                "text-4xl",
                                "hover:scale-105"
                            )} />
                        </Link>}
                        {website && <Link href={website} target="_blank">
                            <EcorcesIcon icon={faGlobe} className={mergeClasses(
                                "text-4xl",
                                "hover:scale-105"
                            )} />
                        </Link>}
                    </div>
                </div>;
            })}
        </div>
    </div>
}

const PartenairesBlock = async () => {

    const [
        subtitle,
        partenaires
    ] = await Promise.all([
        getBlockContent("COMPAGNIE_PARTENAIRES"),
        getPartenaires({
            enabledOnly: true
        })
    ]);

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "border-t border-golden",
        "px-4 pt-8 pb-6"
     )}>
        <div className="text-center heading-1">Partenaires</div>
        <div className="text-center heading-2 text-white">{subtitle}</div>

        <div className={mergeClasses(
            "flex flex-row flex-wrap items-center justify-around",
            "gap-y-4 mt-6"
        )}>
            {partenaires.map((partenaire, index) => <PartenaireCard
                partenaire={partenaire}
                key={`Partenaire-${index.toString().padStart(2, " ")}`}
            />)}
        </div>
    </div>
}

type PartenaireCardProps = {
    partenaire: EcorcesPartenaire;
}

const PartenaireCard = (props: PartenaireCardProps) => {
    const {
        partenaire: {
            image,
            url
        }
    } = props;

    return <Link href={url} target="_blank">
        <div className={mergeClasses(
            "aspect-square rounded",
            "h-24",
            "bg-center bg-contain bg-no-repeat",
            "cursor-pointer hover:scale-105",
            "bg-white/20"
        )} style={{
            backgroundImage: backgroundUrl(image.url)
        }}>

        </div>
    </Link>
}

const ContactBlock = async () => {

    const [
        contactPro01,
        contactPro02,
        contactEcole01,
        contactEcole02,
        contactAutre01,
        contactAutre02,
    ] = await Promise.all([
        getBlockContent("COMPAGNIE_CONTACT_PRO_01"),
        getBlockContent("COMPAGNIE_CONTACT_PRO_02"),
        getBlockContent("COMPAGNIE_CONTACT_ECOLE_01"),
        getBlockContent("COMPAGNIE_CONTACT_ECOLE_02"),
        getBlockContent("COMPAGNIE_CONTACT_AUTRE_01"),
        getBlockContent("COMPAGNIE_CONTACT_AUTRE_02"),
    ]);

    return <div className={mergeClasses(
        "flex flex-col items-center",
        "px-6 pt-8 mt-4",
        "border-t border-golden",
        "bg-no-repeat bg-[size:auto_130%] bg-[position:100%_20%]"
    )} style={{
        backgroundImage: "url(/img/misc/homepage-pro-bg.png)"
    }}>
        <div className="text-center heading-1">Contact</div>
        <div className="text-center heading-2 text-white">Selon si vous êtes...</div>

        <div className="text-center text-golden/60 mt-8 font-semibold">{contactPro01}</div>
        <div className="text-center text-white font-light">{contactPro02}</div>
        <TextLink href="/espace-pro" className="underline mt-4">Espace professionnels</TextLink>
        
        <div className="text-center text-golden/60 mt-8 font-semibold">{contactEcole01}</div>
        <div className="text-center text-white font-light">{contactEcole02}</div>
        <TextLink href="/ecole" className="underline mt-4">Offres pédagogiques</TextLink>
        
        <div className="text-center heading-1 mt-12">{contactAutre01}</div>
        <div className="text-center heading-2 text-white">{contactAutre02}</div>
        <EcorcesIcon icon={faArrowTurnDown} className="text-2xl mb-10" />
    </div>
    
}

export default CompagniePage;