"use client";

import { useMemo } from "react";
import EcorcesTabComponent, { TabContent } from "../../../components/ui/ecorces-tab-component";
import { uiBreakPoints, layoutClasses } from "../../../components/ui/ecorces-ui";
import { TextLink } from "../../../components/ui/text-link";
import { useWindowSize } from "../../../lib/hooks";
import { mergeClasses } from "../../../lib/utils";
import { EcorcesService } from "../../../server/services";

export type ServicesBlockContentProps = {
    services: EcorcesService[];
    autresActivites: string;
}

export const ServicesBlockContent = (props: ServicesBlockContentProps) => {

    const {
        services,
        autresActivites
    } = props;

    const { width } = useWindowSize();

    if (width === 0) {
        return <></>;
    }
    if (width < uiBreakPoints.lg) {

        const tabs: TabContent[] = services.map(service => ({
            title: service.name,
            content: service.content
        }));

        return <div className={mergeClasses(
            "flex flex-col items-stretch",
            "border-t border-golden",
            "pt-2",
            layoutClasses.mainColumnPadding
        )}>
            <div className={mergeClasses(
                "uppercase font-semibold text-3xl",
                "text-white",
                "mb-2",
            )}>
                Autres activités
            </div>
            <div className="px-1">
                {autresActivites}
            </div>
            <EcorcesTabComponent
                className="mt-6"
                tabs={tabs}
            />
    
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
    else {
        const rowSpan = 1 + Math.ceil(services.length / 2);

        return <div className={mergeClasses(
            "grid grid-cols-[5fr_5fr_7fr]",
            "gap-6",
            "pb-10",
            "mt-6",
            layoutClasses.mainColumnPadding,
        )}>
            <div className={mergeClasses(
                "col-span-2",
                "border-t border-golden",
                "pt-4"
            )}>
                <div className={mergeClasses(
                    "uppercase font-semibold text-3xl",
                    "mb-2",
                )}>
                    Autres activités
                </div>
                <div className="px-1">
                    {autresActivites}
                </div>
            </div>

            <div className={mergeClasses(
                "col-start-3",
                "px-4 pb-[8rem]",
                "flex flex-col items-center justify-center",
            )} style={{
                gridRow: `span ${rowSpan} / span ${rowSpan}`
            }}>
                <div className={mergeClasses(
                    "bg-center bg-no-repeat bg-cover",
                    "w-24 aspect-square",
                    "bg-[url('/img/misc/voir-compagnie-anim.gif')]"
                )}/>
                <TextLink href="/compagnie" className="underline">
                    Voir la page de notre compagnie
                </TextLink>
            </div>

            {services.map((service, index) => <div
                key={`Service-${index.toString().padStart(2, "0")}`}
                className={mergeClasses(
                    "flex flex-col items-stretch",
                    "gap-1 pt-3",
                    "border-t border-golden",
                )}
            >
                <div className={mergeClasses(
                    "text-xl text-white"
                )}>
                    {service.name}
                </div>

                <div className={mergeClasses(

                )}>
                    {service.content}
                </div>
            </div>)}
        </div>
    }

    
}