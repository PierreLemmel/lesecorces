import Link from "next/link";
import { mergeClasses } from "../../lib/utils";
import { EcorcesActivite } from "../../server/server";
import { cardDateFormat } from "../ui/ecorces-ui";
import { BanneerBackground } from "./banneer-background";

export type ActiviteCardProps = {
    activite: EcorcesActivite;
    showTags?: boolean;
}

export const ActiviteCard = (props: ActiviteCardProps) => {

    const {
        activite: {
            type,
            title,
            date,
            endDate,
            city,
            banneer,
            link = "",
        },
        showTags = true
    } = props;

    return <Link
        href={link}
        target="_blank"
    ><div
        className={mergeClasses(
            "cursor-pointer transition-transform transform-gpu hover:scale-105",
            "relative",
            "px-2"
        )}
    >
        {banneer && <BanneerBackground banneer={banneer} />}
        <div className={mergeClasses(
            "flex flex-col z-10",
            "relative items-stretch top-0 left-0 bottom-0 right-0",
            "px-2 py-2"
        )}>
            {showTags && <div className={mergeClasses(
                "flex flex-row justify-end gap-1",
            )}>
                <div className="border border-golden rounded px-[0.32rem] py-[0.07rem]">
                    {city}
                </div>
                <div className="border border-golden rounded px-[0.32rem] py-[0.07rem]">
                    {type}
                </div>
            </div>}
            <div className={mergeClasses(
                "w-full",
                "text-2xl font-bold text-white text-left truncate",
                "mt-3"
            )}>
                {title}
            </div>
            <div className={mergeClasses(
                "text-sm text-white/70"
            )}>
                {cardDateFormat(date, endDate)}
            </div>
        </div>
    </div></Link>;
}