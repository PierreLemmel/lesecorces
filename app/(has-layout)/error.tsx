"use client";

import { mergeClasses } from "../../lib/utils";

const CustomError = () => {

    return  <div className={mergeClasses(
        "flex flex-col items-stretch gap-6",
        "pt-[4.2rem]"
    )}>
        <div className={mergeClasses(
            "flex flex-col items-stretch justify-center",
            "min-h-[75vh] w-full",
            "px-4 py-6",
            "bg-center bg-no-repeat bg-cover",
            "relative z-20",
        )} style={{
            backgroundImage: "url('/img/misc/error.jpg')"
        }}>
            <div className="text-white text-center text-xl">Oups, quelque chose ne se passe pas comme prévu.</div>
            <div className="absolute inset-0 bg-black/50 -z-10" />
        </div>
    </div>
}

export default CustomError;