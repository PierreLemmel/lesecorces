"use client";

import { IconProp } from "@fortawesome/fontawesome-svg-core"
import EcorcesFoldable from "../../../components/ui/ecorces-foldable"
import { EcorcesIcon } from "../../../components/ui/icon"
import { mergeClasses } from "../../../lib/utils"
import { useState } from "react";

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
        folded={folded}
    />

    return <EcorcesFoldable
        header={foldableHeader}
        headerClassName="py-2 px-3"
        onFolded={setFolded}
        className={className}
    >
        {children}
    </EcorcesFoldable>
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
        "gap-1"
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