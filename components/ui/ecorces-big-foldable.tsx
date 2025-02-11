"use client";

import React, { useState } from "react";
import { mergeClasses } from "../../lib/utils";

export type EcorcesBigFoldableProps = {
    className?: string;

    header: React.ReactNode;
    content: React.ReactNode;
    footer: React.ReactNode;
}

const EcorcesBigFoldable = (props: EcorcesBigFoldableProps) => {

    const {
        header,
        content,
        footer
    } = props;

    const [folded, setFolded] = useState(true);

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
    )}>
        <div>
            {header}
        </div>
        <div>
            {content}
        </div>
        <div>
            {footer}
        </div>
    </div>
}

export default EcorcesBigFoldable;