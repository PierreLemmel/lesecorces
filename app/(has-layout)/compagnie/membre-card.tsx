"use client";

import { motion } from "framer-motion";
import { mergeClasses, sequence } from "../../../lib/utils";
import { EcorcesMembre } from "../../../server/membres";
import { useState } from "react";
import { EcorcesIcon, EcorcesIconProps } from "../../../components/ui/icon";
import { faFacebook, faInstagram, faSoundcloud } from "@fortawesome/free-brands-svg-icons";
import { faChevronLeft, faChevronRight, faCircle, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { TextButton } from "../../../components/ui/text-button";
import IconSvg from "../../../components/ui/icon-svg";
import Link from "next/link";
import { backgroundUrl, croppedImageUrl } from "../../../components/ui/ecorces-ui";

export type MembreCardProps = {
    membre: EcorcesMembre
}

export const MembreCard = (props: MembreCardProps) => {
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

                    <Gallery gallery={gallery} />

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

type GelleryProps = {
    gallery: EcorcesMembre["gallery"]
}

const Gallery = (props: GelleryProps) => {
    const {
        gallery
    } = props;

    const [index, setIndex] = useState(0);

    return <div className={mergeClasses(
        "w-screen h-[calc(min(82vw,82vh))]",
        "relative",
        "-left-2"
    )}>
        <motion.div className={mergeClasses(
            "left-0 h-full",
            "flex flex-row items-stretch",
            "gap-[calc(min(18vh,18vw))]"
        )} animate={{
            translateX: `calc((18 / 2 - 100 * ${index}) * min(1vh, 1vw))`
        }} transition={{
            type: "spring",
            stiffness: 100,
            damping: 20
        }}>
            {gallery.map((img, idx) => {
                return <div key={idx} className={mergeClasses(
                    "aspect-square h-full",
                    "bg-cover bg-center bg-no-repeat",
                    "cursor-pointer"
                )} style={{
                    backgroundImage: `url(${img.url})`
                }}>
                </div>
            })}
            
        </motion.div>

        <GalleryArrow
            className="left-0"
            icon={faChevronLeft}
            enabled={index > 0}
            onClick={() => setIndex(Math.max(0, index - 1))}
        />
        <GalleryArrow
            className="right-0"
            icon={faChevronRight}
            enabled={index < gallery.length - 1}
            onClick={() => setIndex(Math.min(gallery.length - 1, index + 1))}
        />

        <div className={mergeClasses(
            "flex flex-row items-center justify-center",
            "gap-3",
            "absolute bottom-1 left-0 right-0",
        )}>
            {sequence(gallery.length).map(i => <div
                key={`Bullet-${i.toString().padStart(2, "0")}`}
                className={mergeClasses(
                    i === index ? "text-white" : "text-white/20"
                )}
            >
                <EcorcesIcon icon={faCircle} className="text-[0.68rem]" />
            </div>)}
        </div>
    </div>
}

type GalleryArrowProps = {
    enabled: boolean;
    icon: EcorcesIconProps["icon"];
    className: string;
    onClick: () => void;
}



const gaEnabledClass = "cursor-pointer opacity-80 hover:opacity-100";
const gaDisabledClass = "opacity-20 hover:opacity-20";

const GalleryArrow = (props: GalleryArrowProps) => {
    const {
        enabled,
        icon,
        className,
        onClick
    } = props;

    const handleClick = () => {
        if (enabled) {
            onClick();
        }
    }

    return <div className={mergeClasses(
        "flex flex-col items-center justify-center",
        "absolute top-0 bottom-0 z-10",
        "w-8",
        "text-white",
        enabled ? gaEnabledClass : gaDisabledClass,
        className
    )} onClick={handleClick}>
        <EcorcesIcon icon={icon} className="text-xl hover:scale-105" />
    </div>
}