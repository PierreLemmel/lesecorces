import { faArrowTurnDown, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { EcorcesIcon } from "../../../components/ui/icon";
import { mergeClasses } from "../../../lib/utils";
import { getActivites, getBlockContent } from "../../../server/server";
import { TextLink } from "../../../components/ui/text-link";
import { ActiviteCard } from "../../../components/parts/activite-card";
import { EcorcesPartenaire, getAmi, getMembre, getPartenaires } from "../../../server/membres";
import { MembreCard } from "./membre-card";
import { backgroundUrl, croppedImageUrl, layoutClasses } from "../../../components/ui/ecorces-ui";
import { faInstagram, faFacebook, faSoundcloud } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { Footer } from "../../../components/layout/footer";
import MainMenu from "../../../components/layout/main-menu";

const CompagniePage = () => {

    return <div className="w-screen min-h-screen flex flex-col bg-water text-golden">

        <MainMenu />

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
        "flex items-stretch",
        "flex-col justify-between",
        "md:flex-row",
        "pt-[4.2rem] pb-2 md:pb-4 lg:pb-6",
        layoutClasses.mainColumnPadding
    )}>
        <div className={mergeClasses(
            "flex flex-col items-stretch",
        )}>
            <div className="text-white">Compagnie</div>
            <div className="uppercase font-semibold">{headerContent}</div>
        </div>
        <EcorcesIcon icon={faArrowTurnDown} className={mergeClasses(
            "text-2xl md:text-3xl",
            "mt-4 mr-6",
        )} />
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
        "grid",
        "grid-cols-1 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr]",
        "grid-rows-[auto_auto]",
        "gap-x-4 lg:gap-x-6",
        "md:py-4 lg:py-6    ",
        layoutClasses.mainColumnPadding,
        "bg-cover bg-no-repeat bg-center",
        "bg-blend-multiply bg-black/75"
    )} style={{
        backgroundImage: "url(/img/qacda/qacda-04.jpeg)"
    }}>
        <div className={mergeClasses(
            "hidden",
            "md:flex flex-col items-center",
            "justify-center gap-2",
            "row-span-2 w-full",
        )}>
            <div className={mergeClasses(
                "bg-center bg-no-repeat bg-cover",
                "w-24 aspect-square",
                "bg-[url('/img/misc/voir-compagnie-anim.gif')]"
            )}/>
            <TextLink href="/compagnie" className="underline">
                Voir nos spectacles
            </TextLink>
        </div>

        <div className={mergeClasses(
            "md:col-span-2",
            "border-t border-golden",
            "px-2 pt-1",
            "pb-4 md:pb-6",
            "md:font-bold"
        )}>
            {presentationContent}
        </div>

        <div className={mergeClasses(
            "flex flex-col items-stretch",
            "border-t border-golden",
            "px-2 pt-2 gap-2",
            "pb-8 md:pb-0"
        )}>
            <div className={mergeClasses(
                "text-white font-semibold text-xl"
            )}>
                Les origines
            </div>
            <div>{origineContent}</div>
        </div>

        <div className={mergeClasses(
            "flex flex-col items-stretch",
            "border-t border-golden",
            "px-2 pt-2 gap-2",
            "pb-8 md:pb-0"
        )}>
            <div className={mergeClasses(
                "text-white font-semibold text-xl"
            )}>
                Pourquoi Écorcés ?
            </div>
            <div>{pourquoiEcorcesContent}</div>
        </div>
    </div>
}


const ActualitesBlock = async () => {

    const activites = await getActivites({
        upcoming: true,
        visible: true,
        limit: 6
    });

    return <div className={mergeClasses(
        "flex flex-col items-center",
        layoutClasses.mainColumnPadding,
        "mb-8 mt-8",
    )}>
        <div className={mergeClasses(
            layoutClasses.heading1
        )}>
            Nos actualités
        </div>
        
        <div className={mergeClasses(
            "w-full",
            "grid",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
            "compagnie-actualites-grid",
            "gap-2 mb-4 mt-2",
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
       "flex flex-col items-center",
       "border-t border-golden",
       "pt-8",
       "pb-5 md:pb-8 lg:pb-12",
       layoutClasses.mainColumnPadding
    )}>
        <div className={mergeClasses(
            layoutClasses.heading1,
            "text-center"
        )}>
            Aussi avec nous
        </div>
        <div className={mergeClasses(
            layoutClasses.heading2,
            "text-center text-white"
        )}>
            {subtitle}
        </div>
        <div className={mergeClasses(
            "grid",
            "grid-cols-1 lg:grid-cols-3",
            "w-full max-w-[60rem]",
            "mt-10 gap-6",
            "px-2"
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
        "pt-8 pb-6",
        layoutClasses.mainColumnPadding
     )}>
        <div className={mergeClasses(
            layoutClasses.heading1,
            "text-center"
        )}>
            Partenaires
        </div>
        <div className={mergeClasses(
            layoutClasses.heading2,
            "text-center text-white"
        )}>
            {subtitle}
        </div>

        <div className={mergeClasses(
            "grid",
            "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12",
            "gap-2",
            "mt-6"
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
            "w-full",
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
        "grid",
        "items-center",
        "grid-cols-1 lg:grid-cols-2",
        "mt-4",
        layoutClasses.mainColumnPadding,
        "border-t border-golden",
        "bg-no-repeat bg-cover bg-[position:100%_20%]",
        "py-10 md:py-14 lg:py-20"
    )} style={{
        backgroundImage: "url(/img/misc/homepage-pro-bg.png)"
    }}>
        <div className={mergeClasses(
            "flex flex-col items-center",
            "lg:col-span-2"
        )}>
            <div className={mergeClasses(
                layoutClasses.heading1,
                "text-center"
            )}>
                Contact
            </div>
            <div className={mergeClasses(
                layoutClasses.heading2,
                "text-center text-white"
            )}>
                Selon si vous êtes...
            </div>
        </div>

        <div className={mergeClasses(
            "flex flex-col items-center"
        )}>
            <div className="text-center text-golden/60 mt-8 font-semibold">{contactPro01}</div>
            <div className="text-center text-white font-light">{contactPro02}</div>
            <TextLink href="/espace-pro" className="underline mt-4">Espace professionnels</TextLink>
        </div>

        <div className={mergeClasses(
            "flex flex-col items-center"
        )}>
            <div className="text-center text-golden/60 mt-8 font-semibold">{contactEcole01}</div>
            <div className="text-center text-white font-light">{contactEcole02}</div>
            <TextLink href="/ecole" className="underline mt-4">Offres pédagogiques</TextLink>
        </div>

        <div className={mergeClasses(
            "flex flex-col items-center",
            "lg:col-span-2"
        )}>
            <div className={mergeClasses(
                layoutClasses.heading1,
                "text-center mt-12"
            )}>
                {contactAutre01}
            </div>
            <div className={mergeClasses(
                layoutClasses.heading2,
                "text-center text-white"
            )}>
                {contactAutre02}
            </div>
            <EcorcesIcon icon={faArrowTurnDown} className="text-2xl lg:text-3xl mt-2" />
        </div>
    </div>
    
}

export default CompagniePage;