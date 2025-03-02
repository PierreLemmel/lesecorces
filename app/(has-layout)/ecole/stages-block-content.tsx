import { ActiviteCard } from "../../../components/parts/activite-card";
import { mergeClasses } from "../../../lib/utils";
import { EcorcesActivite } from "../../../server/server"

export type StagesBlockContentProps = {
    stagesLyon: EcorcesActivite[];
    stagesParis: EcorcesActivite[];
    stagesAutres: EcorcesActivite[];
}

const StagesBlockContent = (props: StagesBlockContentProps) => {
    const {
        stagesLyon,
        stagesParis,
        stagesAutres,
    } = props;

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "gap-4 mt-4 pb-3",
    )}>
        <StagesBlockVille
            title="Stages à Lyon"
            stages={stagesLyon}
        />
        <StagesBlockVille
            title="Stages à Paris"
            stages={stagesParis}
        />
        <StagesBlockVille
            title="Stages ailleurs"
            stages={stagesAutres}
        />
    </div>
}

type StagesBlockVilleProps = {
    title: string;
    stages: EcorcesActivite[];
}

const StagesBlockVille = (props: StagesBlockVilleProps) => {
    const {
        title,
        stages
    } = props;

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "gap-2"
    )}>
        <div className={mergeClasses(
            "text-left font-semibold text-xl"
        )}>
            {title}
        </div>
        <div className={mergeClasses(
            "grid",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            "gap-2"
        )}>
            {stages.length > 0 ? stages.map((stage, index) => <ActiviteCard
                key={`Stage-${index.toString().padStart(2, "0")}`}
                activite={stage}
                showTags={false}
            />) : <div className="text-white">
                Aucun stage prévu pour l&apos;instant
            </div>}
        </div>
    </div>
}


export default StagesBlockContent;