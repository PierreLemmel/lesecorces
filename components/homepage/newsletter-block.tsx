"use client";

import { mergeClasses } from "../../lib/utils";
import { NewsLetter } from "../ui/newsletter";

export const NewsLetterBlock = () => {

    return <div className={mergeClasses(
        "flex flex-col items-stretch px-2",
        "mb-8"
    )}>
        <div className="heading-1 text-center">On se perd pas de vue</div>
        <div className="heading-2 text-center text-white">On reste en contact, mais de manière non invasive</div>
        <div className="text-white mt-6 text-center">Stages, tournées, actualités, ne manquez aucune sortie des Écorcés.</div>

        <NewsLetter className="mt-4" />
    </div>;
}