"use client";

import { useState } from "react";
import { mergeClasses } from "../../../lib/utils"
import { EcorcesMembre } from "../../../server/membres"
import { MembreCard } from "./membre-card";

export type MembresBlockContentProps = {
    membres: EcorcesMembre[];
}

export const MembresBlockContent = (props: MembresBlockContentProps) => {

    const {
        membres
    } = props;

    const [otherGallery, setOtherGallery] = useState(false);

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "gap-8 md:gap-0 pt-6 md:pt-0",
        "border-t border-golden"
    )}>
        {membres.map((membre, index) => <MembreCard
            membre={membre}
            key={`Membre-${index.toString().padStart(2, " ")}`}
            otherGallery={otherGallery}
            setOtherGallery={setOtherGallery} 
        />)}
    </div>
}