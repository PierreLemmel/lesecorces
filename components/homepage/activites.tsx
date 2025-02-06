"use client";

import { useRef, useState, useEffect } from "react";
import { mergeClasses } from "../../lib/utils";
import { TextLink } from "../ui/text-link";
import { useEffectAsync, useElementSize } from "../../lib/hooks";
import { getImageData, uiBreakPoints } from "../ui/ecorces-ui";
import { EcorcesBanneer, EcorcesActivite, getActivites } from "../../server/server";
import LoadingSpinner from "../ui/loading-spinner";
import { Timestamp } from "firebase-admin/firestore";
import Link from "next/link";

export const ActivitesBlock = () => {
    const [width, setWidth] = useState<number>(0);
    const rootRef = useRef<HTMLDivElement>(null);
    useElementSize(rootRef, ({ width }) => setWidth(width));

    const [loading, setLoading] = useState<boolean>(true);
    const [activites, setActivites] = useState<EcorcesActivite[]>([]);

    useEffectAsync(async () => {
        setLoading(true);
        
        const activites = await getActivites({
            upcoming: true,
            visible: true,
            limit: 3
        });

        setLoading(false);
        setActivites(activites);
    }, []);

    const props: ActivitesBlockProps = {
        loading,
        activites
    }

    return (width < uiBreakPoints.md) ? 
        <ActivitesBlock_Small {...props} /> : 
        <ActivitesBlock_Large {...props} />;
}

type ActivitesBlockProps = {
    loading: boolean;
    activites: EcorcesActivite[];
}

const ActivitesBlock_Small = (props: ActivitesBlockProps) => {

    const {
        loading,
        activites
    } = props;

    return <div className={mergeClasses(
        "flex flex-col items-center",
        "mb-12 mt-8"
    )}>
        <div className="heading-1">Nos prochaines activités</div>
        
        <div className="flex flex-col items-stretch gap-2 px-3 w-full mb-4 mt-2">
            <ActivitesBlockContent_Small loading={loading} activites={activites} />
        </div>
        
        <div><TextLink href="/activites" className="underline">Tout voir</TextLink></div>
    </div>;
}

const ActivitesBlockContent_Small = (props: ActivitesBlockProps) => {

    const {
        loading,
        activites
    } = props;

    if (loading) {
        return <LoadingSpinner />
    }
    else if (activites.length > 0) {
        return <>
            {activites.map((activite, index) => <ActiviteCard_Small
                activite={activite}
                key={`Activity-${index.toString().padStart(2, " ")}`}
            />)}
        </>
    }
    else {
        return <div className="text-white mt-4">
            Aucune activité n&apos;est prévue pour l&apos;instant
        </div>
    }
}

const ActivitesBlock_Large = (props: ActivitesBlockProps) => {
    return <div className={mergeClasses(
        "flex flex-col items-center",
        "mb-8"
    )}>
        <div className="heading-1">Nos prochaines activités</div>
        <div><TextLink href="/activites" className="underline">Tout voir</TextLink></div>
    </div>;
}

type ActiviteCardProps = {
    activite: EcorcesActivite;
}

const ActiviteCard_Small = (props: ActiviteCardProps) => {

    const {
        activite: {
            type,
            title,
            date,
            endDate,
            city,
            banneer,
            link = ""
        }
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
            <div className={mergeClasses(
                "flex flex-row justify-end gap-1",
            )}>
                <div className="border border-golden rounded px-[0.32rem] py-[0.07rem]">
                    {city}
                </div>
                <div className="border border-golden rounded px-[0.32rem] py-[0.07rem]">
                    {type}
                </div>
            </div>
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


function cardDateFormat(date: Timestamp, endDate?: Timestamp) {

    const year = (endDate ?? date).toDate().getFullYear()

    const formatter = new Intl.DateTimeFormat('fr-FR', {
        month: 'long',
        day: 'numeric'
    })

    if (endDate) {
        return `Du ${formatter.format(date.toDate())} au ${formatter.format(endDate.toDate())} ${year}`;
    }
    else {
        return `Le ${formatter.format(date.toDate())} ${year}`;
    }
}

type BanneerBackgroundProps = {
    banneer: EcorcesBanneer;
    className?: string;
}

const BanneerBackground = (props: BanneerBackgroundProps) => {

    const {
        banneer: {
            url,
            cropArea
        },
        className
    } = props;

    const [imgData, setImgData] = useState<string | null>(null);

    useEffect(() => {
        getImageData(url, cropArea, setImgData)
    }, [url, cropArea])

    return <div
        className={mergeClasses(
            "absolute inset-0 w-full h-full",
            "bg-cover bg-center bg-no-repeat",
            "rounded-md",
            className
        )}
        style={{
            backgroundImage: imgData ? `url(${imgData})` : undefined,
        }}
    >
        <div className={mergeClasses(
            "w-full h-full",
            "bg-gradient-to-r from-black/90 via-black/20 to-black/90"
        )}
        />
    </div>
}