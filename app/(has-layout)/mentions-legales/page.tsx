import { mergeClasses } from "../../../lib/utils";
import { getBlockContent } from "../../../server/server";

const MentionsLegalesPage = async () => {

    const editeur = await getBlockContent("MENTIONS_LEGALES_EDITEUR");
    const directeurPublication = await getBlockContent("MENTIONS_LEGALES_DIRECTEUR_PUBLICATION");
    const hebergement = await getBlockContent("MENTIONS_LEGALES_HEBERGEMENT");
    const copyright = await getBlockContent("MENTIONS_LEGALES_COPYRIGHT");
    const credits = await getBlockContent("MENTIONS_LEGALES_CREDITS");

    const parts:[string, string][] = [
        ["Editeur", editeur],
        ["Directeur de la publication", directeurPublication],
        ["Hébergement", hebergement],
        ["Droits d'auteur", copyright],
        ["Crédits", credits],
    ]

    return <div className={mergeClasses(
        "flex flex-col items-stretch gap-6",
        "pt-[4.2rem] px-3 pb-8"
    )}>
        <div className="text-white text-2xl">Mentions légales</div>
        {parts.map(([title, content], index) => <div className={mergeClasses(
            "flex flex-col",
            "border-t border-golden",
            "pt-1"
        )} key={index}>
            <div className="font-semibold text-lg">{title}</div>
            {content.split("\n").map((line, index) => <div key={index} className="text-white/80 text-sm">{line}</div>)}
        </div>)}
    </div>
}

export default MentionsLegalesPage;