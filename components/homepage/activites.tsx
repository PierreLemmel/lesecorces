"use client";

import { useRef, useState, useEffect } from "react";
import { mergeClasses } from "../../lib/utils";
import { TextLink } from "../ui/text-link";
import { useEffectAsync, useElementSize } from "../../lib/hooks";
import { uiBreakPoints } from "../ui/ecorces-ui";
import { EcorcesActivite, getUpcomingActivites } from "../../server/server";
import LoadingSpinner from "../ui/loading-spinner";

export const ActivitesBlock = () => {
    const [width, setWidth] = useState<number>(0);
    const rootRef = useRef<HTMLDivElement>(null);
    useElementSize(rootRef, ({ width }) => setWidth(width));

    const [loading, setLoading] = useState<boolean>(true);
    const [activites, setActivites] = useState<EcorcesActivite[]>([]);

    useEffectAsync(async () => {
        setLoading(true);
        
        const activites = await getUpcomingActivites();

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
        "flex flex-col items-center"
    )}>
        <div className="heading-1">Nos prochaines activités</div>
        
        <div className="h-16">
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
        return <div>Aucune activité n'est prévue pour l'instant</div>
    }
    else {
        return <>
            {activites.map((activite, index) => <ActiviteCard
                activite={activite}
                key={`Activity-${index.toString().padStart(2, " ")}`}
            />)}
        </>
    }
}

const ActivitesBlock_Large = (props: ActivitesBlockProps) => {
    return <div className={mergeClasses(
        "flex flex-col items-center"
    )}>
        <div className="heading-1">Nos prochaines activités</div>
        <div><TextLink href="/activites" className="underline">Tout voir</TextLink></div>
    </div>;
}

type ActiviteCardProps = {
    activite: EcorcesActivite;
}

const ActiviteCard = (props: ActiviteCardProps) => {

    const {
        activite: {
            type,
            title,
            description,
            date,
            city,
            imageUrl,
            link
        }
    } = props;

    return <div style={{
        backgroundImage:`url(${imageUrl})`
    }}>
        <div>{title}</div>
        <div>{type} - {city} - {date.toDate().toDateString()}</div>
        <div>{description}</div>
        {link && <TextLink href={link}>Voir</TextLink>}
    </div>;
}