"use client";

import { Footer } from "../../components/layout/footer";
import MainMenu from "../../components/layout/main-menu";
import { mergeClasses } from "../../lib/utils";

const CustomError = () => {

    return  <div className="w-full min-h-screen flex flex-col bg-black">
            
        <MainMenu />
        <ContentBlock/>
        <Footer />
    </div>
}

const ContentBlock = () => <div className={mergeClasses(
    "flex flex-col items-stretch gap-6",
    "pt-[4.2rem] md:pt-[1.0rem]",
    "mb-6"
)}>
    <div className={mergeClasses(
        "flex flex-col items-stretch justify-center",
        "min-h-[65vh] w-full",
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

export default CustomError;