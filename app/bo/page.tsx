import { TextLink } from "../../components/ui/text-link";
import { mergeClasses } from "../../lib/utils";

const BackOfficePage = () => {

    return <div className={mergeClasses(
        "flex flex-col gap-4"
    )}>
        <TextLink href="/bo/blocks" className="text-lg">Blocks</TextLink>
        <TextLink href="/bo/activites" className="text-lg">Activités</TextLink>
        <TextLink href="/bo/membres" className="text-lg">Membres</TextLink>
        <TextLink href="/bo/offre-pedagogique" className="text-lg">Offres pédagogiques</TextLink>
    </div>
}

export default BackOfficePage;