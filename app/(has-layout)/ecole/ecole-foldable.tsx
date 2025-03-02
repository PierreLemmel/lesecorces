"use client";

import { IconProp } from "@fortawesome/fontawesome-svg-core"
import EcorcesFoldable from "../../../components/ui/ecorces-foldable"
import { EcorcesIcon } from "../../../components/ui/icon"
import { match, mergeClasses } from "../../../lib/utils"
import { useMemo, useRef, useState } from "react";
import { useElementSize } from "../../../lib/hooks";
import { uiBreakPoints } from "../../../components/ui/ecorces-ui";

export type EcoleFoldableProps = {
    header: {
        icon: IconProp;
        title: string;
        description: string;
    }
    children: React.ReactNode;
    className?: string;
}

export const EcoleFoldable = (props: EcoleFoldableProps) => {

    const rootRef = useRef<HTMLDivElement>(null);

    const [width, setWidth] = useState(0);
    useElementSize(rootRef, ({ width }) => setWidth(width));

    const canFold = useMemo(() => width < uiBreakPoints.md, [width]);

    const {
        header: {
            icon: headerIcon,
            title: headerTitle,
            description: headerDescription,
        },
        children,
        className
    } = props;

    const [folded, setFolded] = useState(true);

    const foldableHeader = <FoldableBlockHeader
        icon={headerIcon}
        title={headerTitle}
        description={headerDescription}
        folded={folded && canFold}
    />

    return <div ref={rootRef}>
        <EcorcesFoldable
            header={foldableHeader}
            headerClassName={mergeClasses(
                "py-2 md:py-4",
                "px-2 md:px-6 xl:px-12"
            )}
            contentClassName={mergeClasses(
                "px-2 md:px-6 xl:px-12",
                "md:pb-2"
            )}
            onFolded={setFolded}
            canFold={canFold}
            className={className}
        >
            {children}
        </EcorcesFoldable>
    </div>
}

type FoldableBlockHeaderProps = {
    icon: IconProp;
    title: string;
    description: string;
    folded: boolean;
}

const FoldableBlockHeader = (props: FoldableBlockHeaderProps) => {
    const {
        icon,
        title,
        description,
        folded
    } = props;

    return <div className={mergeClasses(
        "flex flex-col",
        "gap-1",
    )}>
        <div className={mergeClasses(
            "flex flex-row items-center gap-3"
        )}>
            <EcorcesIcon icon={icon} className="text-xl"/>
            <div className={mergeClasses(
                "uppercase font-bold text-xl",
                "transition-colors",
                folded ? "text-golden/40" : "text-golden"
            )}>{title}</div>
        </div>
        <div className="text-white">{description}</div>
    </div>
}