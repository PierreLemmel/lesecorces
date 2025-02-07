"use client";

import { useState, useEffect } from "react";
import { mergeClasses } from "../../lib/utils";
import { EcorcesBanneer } from "../../server/server";
import { getImageData } from "../ui/ecorces-ui";

export type BanneerBackgroundProps = {
    banneer: EcorcesBanneer;
    className?: string;
}

export const BanneerBackground = (props: BanneerBackgroundProps) => {

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