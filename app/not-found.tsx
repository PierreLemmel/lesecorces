import EcorcesLayout from "../components/ui/ecorces-layout";
import { mergeClasses } from "../lib/utils";
import { getBlockContent } from "../server/server";

const CustomNotFound = async () => {

    const notFoundText = await getBlockContent("NOT_FOUND");

    return <EcorcesLayout>
        <div className={mergeClasses(
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
                backgroundImage: "url('/img/misc/not-found.jpeg')"
            }}>
                <div className="text-white text-center text-xl">{notFoundText}</div>
                <div className="absolute inset-0 bg-black/30 -z-10" />
            </div>
        </div>
    </EcorcesLayout>
}

export default CustomNotFound;