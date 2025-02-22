import { faArrowTurnDown, faDownload, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Footer } from "../../../components/layout/footer";
import { EcorcesIcon } from "../../../components/ui/icon";
import { isNullOrEmpty, mergeClasses } from "../../../lib/utils";
import { getBlockContent } from "../../../server/server";
import { EcorcesContact, getContacts } from "../../../server/contacts";
import { EcorcesService, getServices } from "../../../server/services";
import { TextLink } from "../../../components/ui/text-link";
import MainMenu from "../../../components/layout/main-menu";

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
        "flex flex-col items-stretch",
        "px-2 pt-[4.2rem] pb-2",
    )}>
        <div className="text-white">Espace Pro</div>
        <div className="uppercase font-semibold">{headerContent}</div>
        <EcorcesIcon icon={faArrowTurnDown} className="mt-4 text-2xl" />
    </div>
}

const ContactBlock = async () => {

    const contacts = await getContacts("espace-pro");

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
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

        {contacts
            .filter(contact => contact.visible)
            .map((contact, index) => <ContactCard
                key={`Contact-${index.toString().padStart(2, "0")}`}
                contact={contact}
            />)}
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
            "mx-8 px-6 py-6 gap-1",
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
            {!isNullOrEmpty(email) && <div className={mergeClasses(
                "flex flex-row",
                "gap-2"
            )}>
                <EcorcesIcon icon={faEnvelope} className="text-xl" />
                <div className="text-white">{email}</div>
            </div>}
            {!isNullOrEmpty(tel) && <div className={mergeClasses(
                "flex flex-row items-center",
                "gap-2"
            )}>
                <EcorcesIcon icon={faPhone} className="text-xl" />
                <div className="text-white">{tel}</div>
            </div>}
        </div>
    )
}

const DocumentsBlock = async () => {

    const [
        espaceProDiffusion,
        espaceProPresse,
        espaceProVisuels
    ] = await Promise.all([
        getBlockContent("ESPACE_PRO_DIFFUSION"),
        getBlockContent("ESPACE_PRO_PRESSE"),
        getBlockContent("ESPACE_PRO_VISUELS"),
    ]);

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "border-t border-golden",
        "pt-8",
    )}>
        <div className={mergeClasses(
            "flex flex-row items-center justify-center",
            "gap-2"
        )}>
            <EcorcesIcon icon={faDownload} className="text-xl" />
            <div className={mergeClasses(
                "uppercase font-semibold text-xl",
                
            )}>
                Télécharger
            </div>
        </div>
    </div>
}


export const ServicesBlock = async () => {

    const [
        services,
        autresActivites
     ] = await Promise.all([
        getServices("espace-pro", {
            visible: true
        }),
        getBlockContent("ESPACE_PRO_AUTRES_ACTIVITES"),
     ]);

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "border-t border-golden",
        "pt-2",
    )}>
        <div className={mergeClasses(
            "uppercase font-semibold text-3xl",
            "text-white",
            "mb-2 px-1"
        )}>
            Autres activités
        </div>
        <div className="px-1">
            {autresActivites}
        </div>
        
        <div className={mergeClasses(
            "flex flex-col items-center",
            "gap-4 mt-8"
        )}>
            {services.map((service, index) => <ServiceCard
                key={`Service-${index.toString().padStart(2, "0")}`}
                service={service}
            />)}
        </div>

        <div className={mergeClasses(
            "bg-center bg-no-repeat bg-cover",
            "w-full aspect-video",
            "mt-2 mb-9"
        )} style={{
            backgroundImage: "url('/img/qacda/qacda-03.jpeg')"
        }}/>

        <div className="text-center mb-8">
            <TextLink href="/compagnie" className="text-underline">
                Voir la page de notre compagnie
            </TextLink>
        </div>

    </div>
}

const ServiceCard = ({ service }: { service: EcorcesService }) => {

    const {
        name,
        content,
    } = service;

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "gap-2 pl-4 pr-6 pt-3 pb-4",
        "border-t border-golden",
    )}>
        <div className="text-white text-lg font-semibold">{name}</div>
        <div className="">{content}</div>
    </div>
}


export default EspaceProPage;