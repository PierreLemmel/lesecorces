import { mergeClasses } from "../../lib/utils";
import { EcorcesActivite } from "../../server/server";
import { ActiviteCard } from "./activite-card";

export type ActiviteGridDisplayProps = {
    activites: EcorcesActivite[];
    className?: string;
}

export const ActivitesGridDisplay = (props: ActiviteGridDisplayProps) => {

    const {
        activites,
        className,
    } = props;

    return <div className={mergeClasses(
        "w-full",
        "grid",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
        "activites-grid",
        "gap-2",
        className
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
}