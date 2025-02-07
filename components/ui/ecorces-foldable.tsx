"use client";

import { useState } from "react";
import { mergeClasses } from "../../lib/utils";
import { motion } from "framer-motion";
import { EcorcesIcon } from "./icon";
import { faChevronDown, faChevronRight, faChevronUp } from "@fortawesome/free-solid-svg-icons";

type EcorcesFoldableProps = {
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    foldedHeaderClassName?: string;
    unfoldedHeaderClassName?: string;

    header: React.ReactNode;
    children: React.ReactNode;

    onFolded?: (folded: boolean) => void;
}

const EcorcesFoldable = (props: EcorcesFoldableProps) => {
    const {
        className,
        headerClassName,
        contentClassName,
        foldedHeaderClassName,
        unfoldedHeaderClassName,
        header,
        children,
        onFolded
    } = props;

    const [folded, setFolded] = useState(true);

    const onFoldedClicked = () => {
        const newFolded = !folded;

        if (onFolded) {
            onFolded(newFolded);
        }
        setFolded(newFolded);
    }

    return <div className={mergeClasses(
        "flex flex-col",
        "border-b border-golden",
        className
    )}>
        <div onClick={onFoldedClicked}
            className={mergeClasses(
                "flex flex-row items-center gap-3",
                headerClassName,
                folded ? foldedHeaderClassName : unfoldedHeaderClassName
            )}
        >
            <div className="flex-grow">
                {header}
            </div>
            <motion.div animate={{
                rotate: folded ? 0 : 90
            }}>
                <EcorcesIcon icon={faChevronRight} className="text-xl" />
            </motion.div>
        </div>
        <motion.div
            className={mergeClasses(
                "overflow-hidden",
                contentClassName
            )}
            animate={{
                height: folded ? 0 : "auto"
            }}
        >
            {children}
        </motion.div>
    </div>
}

export default EcorcesFoldable;