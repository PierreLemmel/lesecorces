import { Footer } from "../components/layout/footer";
import MainMenu from "../components/layout/main-menu";
import EcorcesLayout from "../components/ui/ecorces-layout";
import { mergeClasses } from "../lib/utils";
import { getBlockContent } from "../server/server";

const CustomNotFound = () => {


    return <EcorcesLayout>

        <MainMenu />

        <ContentBlock />

        <Footer />
    </EcorcesLayout>
}

const ContentBlock = async () => {

    const notFoundText = await getBlockContent("NOT_FOUND");

    return <div className={mergeClasses(
        "w-full",
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
            backgroundImage: "url('/img/misc/not-found.jpeg')"
        }}>
            <div className="text-white text-center text-xl">{notFoundText}</div>
            <div className="absolute inset-0 bg-black/30 -z-10" />
        </div>
    </div>
}

export default CustomNotFound;