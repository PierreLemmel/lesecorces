import { faArrowTurnDown, faDownload, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Footer } from "../../../components/layout/footer";
import { EcorcesIcon } from "../../../components/ui/icon";
import { isNullOrEmpty, mergeClasses } from "../../../lib/utils";
import { getBlockContent } from "../../../server/server";
import { EcorcesContact, getContacts } from "../../../server/contacts";
import { getServices } from "../../../server/services";
import { TextLink } from "../../../components/ui/text-link";
import MainMenu from "../../../components/layout/main-menu";
import { layoutClasses, uiBreakPoints } from "../../../components/ui/ecorces-ui";
import Link from "next/link";
import EcorcesTabComponent, { TabContent } from "../../../components/ui/ecorces-tab-component";
import { BanneerBackground } from "../../../components/parts/banneer-background";
import { ServicesBlockContent } from "./espace-pro-components";

const EspaceProPage = () => {

    return <div className="w-full min-h-screen flex flex-col bg-leaves text-golden">

        <MainMenu />

        <HeaderBlock />

        <ContactBlock />
        <DocumentsBlock />

        <ServicesBlock />

        <Footer />
    </div>
}

const HeaderBlock = async () => {

    const headerContent = await getBlockContent("ESPACE_PRO_HEADER");

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
            <div className="text-white">Espace Pro</div>
            <div className="uppercase font-semibold">{headerContent}</div>
        </div>
        <EcorcesIcon icon={faArrowTurnDown} className={mergeClasses(
            "text-2xl md:text-3xl",
            "mt-4 mr-6",
        )} />
    </div>
}

const ContactBlock = async () => {

    const contacts = await getContacts("espace-pro", {
        visible: true
    });

    return <div className={mergeClasses(
        "flex flex-col items-center",
        "gap-8",
        "mt-8 mb-8 pt-8",
        "border-t border-golden"
    )}>
        <div className={mergeClasses(
            "uppercase text-white text-2xl text-center",
            "mb-2"
        )}>
            Nous contacter
        </div>

        <div className={mergeClasses(
            "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
            "gap-8"
        )}>
            {contacts
                .map((contact, index) => <ContactCard
                    key={`Contact-${index.toString().padStart(2, "0")}`}
                    contact={contact}
                />)}
        </div>
    </div>
}

type ContactCardProps = {
    contact: EcorcesContact;
}

const ContactCard = (props: ContactCardProps) => {

    const {
        contact: {
            name,
            title,
            email,
            tel
        }
    } = props;

    return (
        <div className={mergeClasses(
            "flex flex-col items-center justify-center",
            "bg-golden/30",
            "w-[21rem]",
            "min-h-[10rem]",
            "px-6 py-6 gap-1",
        )}>
            <div className={mergeClasses(
                "font-bold text-golden",
                "text-xl"
            )}>
                {title}
            </div>
            <div className={mergeClasses(
                "uppercase text-golden/70",
                "text-lg",
                "mb-2"
            )}>
                {name}
            </div>
            {!isNullOrEmpty(email) && <Link href={`mailto:${email}`} target="_blank">
            <div className={mergeClasses(
                "flex flex-row",
                "gap-2"
            )}>
                <EcorcesIcon icon={faEnvelope} className="text-xl" />
                <div className="text-white">{email}</div>
            </div>
            </Link>}
            {!isNullOrEmpty(tel) && <Link href={`tel:${tel}`} target="_blank">
                <div className={mergeClasses(
                    "flex flex-row items-center",
                    "gap-2"
                )}>
                    <EcorcesIcon icon={faPhone} className="text-xl" />
                    <div className="text-white">{tel}</div>
                </div>
            </Link>}
        </div>
    )
}

const DocumentsBlock = async () => {

    const [
        espaceProDownload,
        espaceProDiffusion,
        espaceProPresse,
        espaceProVisuels
    ] = await Promise.all([
        getBlockContent("ESPACE_PRO_DOWNLOAD_HEADER"),
        getBlockContent("ESPACE_PRO_DIFFUSION"),
        getBlockContent("ESPACE_PRO_PRESSE"),
        getBlockContent("ESPACE_PRO_VISUELS"),
    ]);

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "border-t border-golden",
        "pt-8 pb-6",
        layoutClasses.mainColumnPadding
    )}>
        <div className={mergeClasses(
            "grid grid-cols-[repeat(auto,2)] lg:grid-cols-[auto,1fr]",
            "items-center",
            "gap-2 lg:gap-0"
        )}>
            <EcorcesIcon icon={faDownload} className={mergeClasses(
                "justify-self-end lg:justify-self-auto",
                "lg:mr-4",
                "lg:row-span-2",
                "text-xl lg:text-4xl",
             )} />
            <div className={mergeClasses(
                "uppercase font-semibold",
                "text-xl lg:text-3xl",
                "lg:col-start-2"
            )}>
                Télécharger
            </div>
            <div className={mergeClasses(
                "col-span-2 lg:col-span-1",
                "lg:col-start-2",
                "text-white",
            )}>
                {espaceProDownload}
            </div>
        </div>

        <div className={mergeClasses(
            "grid",
            "grid-cols-1 lg:grid-cols-3",
            "gap-x-4 gap-y-4",
            "mt-4"
        )}>
            <Link href="/redirect/espace-pro-diffusion" target="_blank">
            <div className={mergeClasses(
                "relative",
                "flex flex-col items-stretch justify-center",
                "h-[7.2rem]",
                "cursor-pointer hover:scale-[1.03] transition-transform",
                "px-4 py-3",
            )}>
                <BanneerBackground banneer="/img/espace-pro/espace-pro-01.jpg" />
                <div className="text-white text-xl font-semibold z-10">Espace diffusion</div>
                <div className="text-white/70 text-sm italic z-10">{espaceProDiffusion}</div>
            </div>
            </Link>

            <Link href="/redirect/espace-pro-presse" target="_blank">
            <div className={mergeClasses(
                "relative",
                "flex flex-col items-stretch justify-center",
                "h-[7.2rem]",
                "cursor-pointer hover:scale-[1.03] transition-transform",
                "px-4 py-3",
            )}>
                <BanneerBackground banneer="/img/espace-pro/espace-pro-02.jpg" />
                <div className="text-white text-xl font-semibold z-10">Espace Presse</div>
                <div className="text-white/70 text-sm italic z-10">{espaceProPresse}</div>
            </div>
            </Link>

            <Link href="/redirect/espace-pro-visuels" target="_blank">
            <div className={mergeClasses(
                "relative",
                "flex flex-col items-stretch justify-center",
                "h-[7.2rem]",
                "cursor-pointer hover:scale-[1.03] transition-transform",
                "px-4 py-3",
            )}>
                <BanneerBackground banneer="/img/espace-pro/espace-pro-03.jpg" />
                <div className="text-white text-xl font-semibold z-10">Charte graphique / Visuels</div>
                <div className="text-white/70 text-sm italic z-10">{espaceProVisuels}</div>
            </div>
            </Link>
        </div>
    </div>
}


const ServicesBlock = async () => {

    const [
        services,
        autresActivites
    ] = await Promise.all([
        getServices("espace-pro", {
            visible: true
        }),
        getBlockContent("ESPACE_PRO_AUTRES_ACTIVITES"),
    ]);

    return <ServicesBlockContent
        services={services}
        autresActivites={autresActivites}
    />
}

export default EspaceProPage;