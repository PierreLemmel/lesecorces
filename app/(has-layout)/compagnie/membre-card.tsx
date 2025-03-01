"use client";

import { motion } from "framer-motion";
import { mergeClasses } from "../../../lib/utils";
import { EcorcesMembre } from "../../../server/membres";
import { useState } from "react";
import { EcorcesIcon } from "../../../components/ui/icon";
import { faFacebook, faInstagram, faSoundcloud } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { TextButton } from "../../../components/ui/text-button";
import IconSvg from "../../../components/ui/icon-svg";
import Link from "next/link";
import { backgroundUrl, croppedImageUrl, layoutClasses, uiBreakPoints } from "../../../components/ui/ecorces-ui";
import { useWindowSize } from "../../../lib/hooks";
import { Gallery_Large, Gallery_Small } from "../../../components/parts/gallery";

export type MembreCardProps = {
    membre: EcorcesMembre;
    otherGallery: boolean;
    setOtherGallery: (value: boolean) => void;
}

export const MembreCard = (props: MembreCardProps) => {
    const { width } = useWindowSize();

    return width < uiBreakPoints.md ? (
        width === 0 ? <></> :
        <MembreCard_Small {...props} />) :
        <MembreCard_Large {...props} />
}

const MembreCard_Small = (props: MembreCardProps) => {

    const {
        membre: {
            name,
            role,
            description: {
                shortBio,
                paragraph1,
                paragraph2,
                paragraph3,
            },
            socials: {
                facebook,
                instagram,
                website,
                soundcloud
            },
            profilePicture,
            gallery
        }
    } = props;

    const [folded, setFolded] = useState(true);

    const croppedUrl = croppedImageUrl(profilePicture.url, profilePicture.cropArea);

    return <div className={mergeClasses(
        "flex flex-col items-stretch z-20",
        "border-b border-golden",
        "px-2",
        "overflow-hidden",
        "relative"
    )}>
        <div className={mergeClasses(
            "absolute top-0 left-2 right-2",
            "flex flex-col items-center",
            "aspect-square",
            "overflow-hidden",
            "cursor-pointer"
        )} onClick={
            () => setFolded(!folded)
        }>
            <div className="text-white text-2xl uppercase mt-1">{name}</div>
            <div className="text-white text-lg">{role}</div>

            <motion.div className={mergeClasses(
                "text-transparent bg-clip-text",
                "mt-10 pr-4",
                "pointer-events-none",
                "bg-gradient-to-b from-white via-white/30 to-transparent",
                " leading-[1.35rem]",
            )} animate={{
                opacity: folded ? 1.0 : 0,
            }} transition={{
                delay: folded ? 0.52 : 0
            }}>
                {shortBio}
            </motion.div>
        </div>
        
        <motion.div className={mergeClasses(
                "-z-10",
                "bg-water",
            )}  animate={{
                transform: folded ? "translateY(0)" : "translateY(4rem)"
            }} transition={{
                duration: 0.4,
                delay: folded ? 0 : 0.52
            }}
            
        >
            <div className={mergeClasses(
                "aspect-square",
                "bg-cover bg-right bg-no-repeat bg-blend-multiply mix-blend-lighten",
            )} style={{
                backgroundImage: [
                    "linear-gradient(to left, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 1) 100%)",
                    backgroundUrl(croppedUrl)
                ].join(", ")
            }} >

            </div>

            <div className={mergeClasses(
                "flex flex-row items-center justify-center",
                "my-6 gap-4"
            )}>
                {instagram && <Link href={instagram} target="_blank">
                    <EcorcesIcon icon={faInstagram} className={mergeClasses(
                        "text-3xl",
                        "hover:scale-105"
                    )} />
                </Link>}
                {facebook && <Link href={facebook} target="_blank">
                    <EcorcesIcon icon={faFacebook} className={mergeClasses(
                        "text-3xl",
                        "hover:scale-105"
                    )} />
                </Link>}
                {soundcloud && <Link href={soundcloud} target="_blank">
                    <EcorcesIcon icon={faSoundcloud} className={mergeClasses(
                        "text-3xl",
                        "hover:scale-105"
                    )} />
                </Link>}
                {website && <Link href={website} target="_blank">
                    <EcorcesIcon icon={faGlobe} className={mergeClasses(
                        "text-3xl",
                        "hover:scale-105"
                    )} />
                </Link>}
            </div>
     
            <div className="overflow-hidden">
                <motion.div
                    className={mergeClasses(
                        "flex flex-col w-full items-stretch",
                        "gap-6",
                        folded && "overflow-hidden"
                    )}
                    animate={{
                        translateY: folded ? "-100%" : "0%",
                        height: folded ? "0" : "auto"
                    }}
                    transition={{
                        duration: 0.4,
                        delay: folded ? 0.65 : 0
                    }}
                >
                    <TextButton
                        onClick={() => setFolded(true)}
                        className="text-center"
                    >
                        Replier la fiche
                    </TextButton>

                    <div className="text-white">
                        {shortBio}
                    </div>

                    <div className={mergeClasses(
                        "flex flex-row",
                        "gap-3"
                    )}>
                        <IconSvg className="w-6 pt-2" />
                        <div className="text-white">
                            {paragraph1}
                        </div>
                    </div>

                    <div className={mergeClasses(
                        "flex flex-row",
                        "gap-3"
                    )}>
                        <IconSvg className="w-6 pt-2" />
                        <div className="text-white">
                            {paragraph2}
                        </div>
                    </div>

                    <div className={mergeClasses(
                        "flex flex-row",
                        "gap-3"
                    )}>
                        <IconSvg className="w-6 pt-2" />
                        <div className="text-white">
                            {paragraph3}
                        </div>
                    </div>

                    <Gallery_Small gallery={gallery} />

                    <TextButton
                        onClick={() => setFolded(true)}
                        className="text-center pb-[6rem]"
                    >
                        Replier la fiche
                    </TextButton>

                </motion.div>
            </div>

        </motion.div>

    </div>
}

const MembreCard_Large = (props: MembreCardProps) => {

    const {
        membre: {
            name,
            role,
            description: {
                shortBio,
                paragraph1,
                paragraph2,
                paragraph3,
            },
            socials: {
                facebook,
                instagram,
                website,
                soundcloud
            },
            profilePicture,
            gallery
        },
        otherGallery,
        setOtherGallery
    } = props;

    const [folded, setFolded] = useState(true);
    const [galleryDisplay, setGalleryDisplay] = useState(false);

    const croppedUrl = croppedImageUrl(profilePicture.url, profilePicture.cropArea);

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "border-b border-golden",
        "px-2",
        "overflow-hidden",
        "isolate",
        "bg-cover bg-right bg-no-repeat bg-blend-multiply",
        otherGallery && "mix-blend-lighten",
        "relative",
        layoutClasses.mainColumnPadding,
        galleryDisplay && "z-50"
    )} style={{
        backgroundImage: [
            "linear-gradient(to left, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 1) 100%)",
            backgroundUrl(croppedUrl)
        ].join(", ")
    }}>
        <div className={mergeClasses(
            "h-[14rem]",
            "flex flex-row items-center",
            "gap-x-10",
            "cursor-pointer"
        )} onClick={() => setFolded(!folded)}>

            <div className={mergeClasses(
                "w-1/3",
                "flex flex-col justify-center items-stretch",
            )}>
                <div className={mergeClasses(
                    "uppercase text-3xl font-extrabold",
                    "text-white",
                )}>
                    {name}
                </div>
                <div className={mergeClasses(
                    "font-semibold text-lg",
                    "text-white"
                )}>
                    {role}
                </div>


                <div className={mergeClasses(
                    "flex flex-row items-center justify-start",
                    "my-4 gap-4"
                )}>
                    {instagram && <Link href={instagram} target="_blank">
                        <EcorcesIcon icon={faInstagram} className={mergeClasses(
                            "text-2xl text-golden/70",
                            "hover:scale-105"
                        )} />
                    </Link>}
                    {facebook && <Link href={facebook} target="_blank">
                        <EcorcesIcon icon={faFacebook} className={mergeClasses(
                            "text-2xl text-golden/70",
                            "hover:scale-105"
                        )} />
                    </Link>}
                    {soundcloud && <Link href={soundcloud} target="_blank">
                        <EcorcesIcon icon={faSoundcloud} className={mergeClasses(
                            "text-2xl text-golden/70",
                            "hover:scale-105"
                        )} />
                    </Link>}
                    {website && <Link href={website} target="_blank">
                        <EcorcesIcon icon={faGlobe} className={mergeClasses(
                            "text-2xl text-golden/70",
                            "hover:scale-105"
                        )} />
                    </Link>}
                </div>

                <TextButton onClick={() => setFolded(!folded)}>
                    {folded ? "Déplier la fiche" : "Replier la fiche"}
                </TextButton>
            </div>

            <div className={mergeClasses(
                "w-2/3",
                "text-white"
            )}>
                {shortBio}
            </div>
        </div>
        
    
        <div className="overflow-hidden">
            <motion.div
                className={mergeClasses(
                    "flex flex-col items-stretch",
                    "gap-6",
                    folded && "overflow-hidden"
                )}
                animate={{
                    translateY: folded ? "-100%" : "0%",
                    height: folded ? "0" : "auto"
                }}
                initial={{
                    translateY: "-100%",
                    height: "0"
                }}
                transition={{
                    duration: 0.4,
                    delay: folded ? 0.65 : 0
                }}
            >
                <div className={mergeClasses(
                    "flex flex-row",
                    "gap-10 "
                )}>
                    <div className={mergeClasses(
                        "flex flex-row",
                        "gap-3"
                    )}>
                        <IconSvg className="w-6 pt-2" />
                        <div className="text-white">
                            {paragraph1}
                        </div>
                    </div>

                    <div className={mergeClasses(
                        "flex flex-row",
                        "gap-3"
                    )}>
                        <IconSvg className="w-6 pt-2" />
                        <div className="text-white">
                            {paragraph2}
                        </div>
                    </div>

                    <div className={mergeClasses(
                        "flex flex-row",
                        "gap-3"
                    )}>
                        <IconSvg className="w-6 pt-2" />
                        <div className="text-white">
                            {paragraph3}
                        </div>
                    </div>
                </div>


                <Gallery_Large
                    gallery={gallery}
                    onGalleryChange={setGalleryDisplay}
                />

                <div className="flex flex-row items-center justify-center">
                    <TextButton
                        onClick={() => setFolded(true)}
                        className="pb-[6rem]"
                    >
                        Replier la fiche
                    </TextButton>
                </div>

            </motion.div>
        </div>

    </div>

}