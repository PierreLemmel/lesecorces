import EcorcesLayout from "../components/ui/ecorces-layout";
import { mergeClasses } from "../lib/utils";

const CustomNotFound = () => {

    return <EcorcesLayout>
        <div className={mergeClasses(
            "flex flex-col items-stretch gap-6",
            "pt-[4.2rem] px-3 pb-8"
        )}>
            IMPOSSIBLE DE TROUVER LA PAGE DEMANDÉE
        </div>
    </EcorcesLayout>
}

export default CustomNotFound;