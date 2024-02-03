import { cssUrl } from "@/lib/files";
import { mergeClasses } from "@/lib/utils";

const Maintenance = () => <div className="text-white text-2xl bg-red-400 min-h-full flex flex-col absolute top-0 bottom-0 left-0 right-0">
    <div style={{
        backgroundImage: cssUrl('img', 'qacdla', 'qacda-banneer2.jpg'),
    }} className={mergeClasses(
        "bg-cover bg-center flex-grow dark brightness-[85%]",
        "flex items-center justify-center h-full"      
    )}>
        <div className={mergeClasses(
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
</div>

export default Maintenance;