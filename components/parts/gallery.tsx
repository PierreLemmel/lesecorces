"use client";

import { faChevronLeft, faChevronRight, faCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { mergeClasses, sequence } from "../../lib/utils";
import { EcorcesSpectacle } from "../../server/spectacles";
import { croppedImageUrl, backgroundUrl } from "../ui/ecorces-ui";
import { EcorcesIcon, EcorcesIconProps } from "../ui/icon";

export type GalleryProps = {
    gallery: EcorcesSpectacle["gallery"]
}

export const Gallery_Small = (props: GalleryProps) => {
    const {
        gallery
    } = props;

    const [index, setIndex] = useState(0);

    return <div className={mergeClasses(
        "w-screen h-[calc(0.75*min(82vw,82vh))]",
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

                const croppedUrl = croppedImageUrl(img.url, img.cropArea);

                return <div key={idx} className={mergeClasses(
                    "h-full aspect-[4/3]",
                    "bg-cover bg-center bg-no-repeat",
                    "cursor-pointer"
                )} style={{
                    backgroundImage: backgroundUrl(croppedUrl)
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
                <EcorcesIcon icon={faCircle} className="text-[0.60rem]" />
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


export type GalleryLargeProps = GalleryProps & {
    onGalleryChange?: (open: boolean) => void;
}


export const Gallery_Large = (props: GalleryLargeProps) => {

    const {
        gallery,
        onGalleryChange
    } = props;

    const [display, setDispay] = useState(false);
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        if (onGalleryChange) {
            onGalleryChange(display);
        }
    }, [display, onGalleryChange]);

    const displayedImg = gallery[index];

    return <div className={mergeClasses(
        "grid",
        "grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6",
        "gap-6",
    )}>
        <motion.div className={mergeClasses(
            "fixed inset-0 ",
            "bg-black/50",
            (!display) && "pointer-events-none",
            "backdrop-blur-sm",
            "z-[100]",
        )} animate={{
            opacity: display ? 1 : 0
        }}
        >
            <div className={mergeClasses(
                "fixed inset-0",
                "flex items-center justify-center",
            )}>
                <GalleryArrow_Large
                    className=""
                    icon={faChevronLeft}
                    enabled={index > 0}
                    onClick={() => setIndex(Math.max(0, index - 1))}
                />
                <div className={mergeClasses(
                    "flex flex-row items-end justify-center",
                    "gap-4 pb-2",
                    "w-[80%] h-[80%] xl:w-[85%] xl:h-[90%]",
                    "bg-contain bg-center bg-no-repeat",
                    "pointer-events-none"
                )} style={{
                    backgroundImage: backgroundUrl(croppedImageUrl(displayedImg.url, displayedImg.cropArea))
                }}>
                    {sequence(gallery.length).map(i => <div
                        key={`Bullet-${i.toString().padStart(2, "0")}`}
                        className={mergeClasses(
                            i === index ? "text-white/80" : "text-white/30"
                        )}
                    >
                        <EcorcesIcon icon={faCircle} className="text-[0.75rem]" />
                    </div>)}
                </div>
                <GalleryArrow_Large
                    className=""
                    icon={faChevronRight}
                    enabled={index < gallery.length - 1}
                    onClick={() => setIndex(Math.min(gallery.length - 1, index + 1))}
                />
                
            </div>
            
            <div className={mergeClasses(
                "absolute",
                "top-6 right-6",
                "hover:scale-105 transition-transform",
                "cursor-pointer",
            )} onClick={() => setDispay(false)}>
                <EcorcesIcon icon={faXmark} className="text-4xl text-white hover:scale-105" maxSize="4rem" />
            </div>
        </motion.div>

        {gallery.map((img, idx) => {
            return <div key={idx} className={mergeClasses(
                "aspect-square",
                "bg-cover bg-center bg-no-repeat",
                "cursor-pointer",
                "hover:scale-[1.025] transition-transform",
            )} style={{
                backgroundImage: backgroundUrl(croppedImageUrl(img.url, img.cropArea))
            }} onClick={() => {
                setDispay(true);
                setIndex(idx);
            }}/>
        })}
    </div>
}


const GalleryArrow_Large = (props: GalleryArrowProps) => {
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
        "z-10",
        "w-16",
        "text-white",
        enabled ? gaEnabledClass : gaDisabledClass,
        className
    )} onClick={handleClick}>
        <EcorcesIcon
            icon={icon}
            className="text-4xl hover:scale-105"
            maxSize="4rem"
        />
    </div>
}