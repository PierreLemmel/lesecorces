import { Inter } from "next/font/google";
import { mergeClasses } from "../../../lib/utils";
import Image from 'next/image';

export default function Page() {
    return <body className={mergeClasses(
        "flex flex-col items-stretch justify-evenly gap-3 min-h-screen",
    )}>
        <div className={mergeClasses(
            "absolute top-0 left-0 w-full h-full z-50",
            "flex items-center justify-center"
        )}>
            <div className={mergeClasses(
                "text-white text-2xl",
                "flex flex-col items-center justify-evenly h-full",
                "text-center italic",
                "opacity-90",
                "w-3/4 md:w-1/2"
            )}>
                <div className={mergeClasses(
                    "md:text-2xl text-2xl",
                )}>
                    Notre site est en maintenance mais nous revenons bientôt !
                </div>
                <div className={mergeClasses()}>
                    Du 29 juin au 21 juillet prochain, retrouvez <b>Quelque Chose a Changé dans l&apos;Air</b> au théâtre de l&apos;Oulle lors du festival d&apos;Avignon !
                </div>
                <div className={mergeClasses("flex flex-col gap-2")}>
                    <div><b>Nous contacter :</b> <a href="mailto:lesecorces@gmail.com">lesecorces@gmail.com</a></div>
                    <div><b>Diffusion :</b> Marie Montalescot - <a href="tel:(+33)6 49 53 92 55">06 49 53 92 55</a></div>
                </div>
            </div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full">
            <Image 
                className="brightness-[85%] object-cover"
                src="/img/qacda/qacda-banneer2.jpg" alt="qacda-banneer" fill
            />
        </div>
    </body>
}
   
Page.ignoreLayout = true;