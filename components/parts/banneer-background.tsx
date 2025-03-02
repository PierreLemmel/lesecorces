import { type } from "node:os";
import { mergeClasses } from "../../lib/utils";
import { EcorcesBanneer } from "../../server/server";
import { backgroundUrl, croppedImageUrl as fullUrl } from "../ui/ecorces-ui";

export type BanneerBackgroundProps = {
    banneer: EcorcesBanneer|string;
    className?: string;
}

export const BanneerBackground = (props: BanneerBackgroundProps) => {

    const {
        banneer,
        className
    } = props;

    const croppedUrl = typeof banneer === 'object' ?
        fullUrl(banneer.url, banneer.cropArea) :
        banneer;

    return <div
        className={mergeClasses(
            "absolute inset-0 w-full h-full",
            "bg-cover bg-center bg-no-repeat",
            "rounded-md",
            className
        )}
        style={{
            backgroundImage: backgroundUrl(croppedUrl),
        }}
    >
        <div className={mergeClasses(
            "w-full h-full",
            "bg-gradient-to-r from-black/90 via-black/20 to-black/90"
        )}
        />
    </div>
}