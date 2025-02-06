"use client";

import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faLeaf } from "@fortawesome/free-solid-svg-icons"
import EcorcesFoldable from "../../../components/ui/ecorces-foldable"
import { EcorcesIcon } from "../../../components/ui/icon"
import { mergeClasses } from "../../../lib/utils"
import { getBlockContent } from "../../../server/server"
import { useState } from "react";

export const StagesBlock = async () => {
    
    const headerDescription = await getBlockContent("ECOLE_STAGE_FOLDABLE_HEADER")

    const [folded, setFolded] = useState(true);

    const foldableHeader = <FoldableBlockHeader
        icon={faLeaf}
        title="Stages"
        description={headerDescription}
        folded={folded}
    />

    return <EcorcesFoldable
        header={foldableHeader}
        headerClassName="py-2 px-3"
        onFolded={setFolded}
    >
        <div>Stages à Lyon</div>
        <div>Stages à Paris</div>
        <div>Stages ailleurs</div>
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

export const FacettesBlock = () => {
    return <div>FACETTES</div>
}

export const CoursHebdoBlock = () => {
    return <div>COURS HEBDO</div>
}