import { ActiviteCard } from "../../../components/parts/activite-card";
import { cardDateFormat } from "../../../components/ui/ecorces-ui";
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
        "gap-4 px-2 mt-4 pb-3"
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
        {stages.length > 0 ? stages.map((stage, index) => <ActiviteCard
            key={`Stage-${index.toString().padStart(2, "0")}`}
            activite={stage}
            showTags={false}
        />) : <div className="text-white">
            Aucun stage prévu pour l&apos;instant
        </div>}
    </div>
}

type StagesBlockCardProps = {
    stage: EcorcesActivite;
}

const StagesBlockCard = (props: StagesBlockCardProps) => {
    const {
        stage: {
            title,
            date,
            endDate,
            link
        }
    } = props;

    return <div className={mergeClasses(
        "flex flex-row items-stretch",
        "gap-3"
    )}>
        <div className="aspect-square h-14 bg-purple-500">

        </div>

        <div className={mergeClasses(
            "flex-grow max-w-[calc(100%-4rem)]",
            "flex flex-col justify-center items-stretch",
            "gap-1"
        )}>
            <div className={mergeClasses(
                "text-white text-right font-semibold leading-none truncate",
                "text-lg"
            )}>
                {title}
            </div>
            <div className={mergeClasses(
                "text-sm italic text-right",
                "text-white/40"
            )}>
                {cardDateFormat(date, endDate)}
            </div>
        </div>
    </div>
}

export default StagesBlockContent;