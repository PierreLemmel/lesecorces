"use client";

import { motion } from "framer-motion";
import { mergeClasses, sequence } from "../../../lib/utils";
import { EcorcesSpectacle } from "../../../server/spectacles";
import { useRef, useState } from "react";
import { EcorcesIcon, EcorcesIconProps } from "../../../components/ui/icon";
import { faChevronLeft, faChevronRight, faCircle, faCross, faGlobe, faXmark } from "@fortawesome/free-solid-svg-icons";
import { TextButton } from "../../../components/ui/text-button";
import { backgroundUrl, croppedImageUrl, ecorcesColor } from "../../../components/ui/ecorces-ui";
import { useElementSize } from "../../../lib/hooks";

export type SpectacleCardProps = {
    spectacle: EcorcesSpectacle
}

export const SpectacleCard = (props: SpectacleCardProps) => {

    const rootRef = useRef<HTMLDivElement>(null);

    const [width, setWidth] = useState(0);
    useElementSize(rootRef, ({ width}) => setWidth(width));

    return <div ref={rootRef}>
        {width > 768 ? <SpectacleCard_Large {...props} /> : <SpectacleCard_Small {...props} />}
    </div>
}

const SpectacleCard_Small = (props: SpectacleCardProps) => {
    const {
        spectacle: {
            name,
            ficheTechnique: {
                creation,
                duree,
                artistes,
                genres
            },
            description: {
                paragraph1,
                paragraph2,
                paragraph3,
            },
            affiche,
            teaser,
            socials: {
                billetreduc
            },
            gallery
        }
    } = props;

    const ficheElements: [string, string, number][] = [
        ["Création", creation, 1],
        ["Durée", duree, 1],
        ["Artistes", artistes, 1],
        ["Genres", genres, 3],
    ]

    const [folded, setFolded] = useState(true);

    const croppedUrl = croppedImageUrl(affiche.url, affiche.cropArea);

    return <div className={mergeClasses(
        "flex flex-col items-stretch z-20",
        "border-t border-golden",
        "pt-6",
        "overflow-hidden",
        "relative"
    )}>
        <div className={mergeClasses(
            "absolute left-2 right-2",
            "top-6",
            "flex flex-col items-center",
            "aspect-square",
            "overflow-hidden",
            "cursor-pointer"
        )} onClick={
            () => setFolded(!folded)
        }>
            <motion.div className={mergeClasses(
                "text-2xl uppercase text-center font-bold mt-1",
            )} animate={{
                color: folded ? "#FFFFFF" : ecorcesColor.golden
            }} transition={{
                delay: folded ? 0 : 0.45
            }}>
                {name}
            </motion.div>

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
                {paragraph1}
            </motion.div>
        </div>
        
        <motion.div className={mergeClasses(
                "-z-10",
                "bg-water",
            )}  animate={{
                transform: folded ? "translateY(0)" : "translateY(4.7rem)"
            }} transition={{
                duration: 0.4,
                delay: folded ? 0 : 0.52
            }}
            
        >
            <motion.div className={mergeClasses(
                "aspect-square",
                "bg-cover bg-right bg-no-repeat bg-blend-multiply mix-blend-lighten",
                "transition-all"
            )} animate={{
                backgroundImage: [
                    folded ? 
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.8) 90%, rgba(0, 0, 0, 1) 100%)" :
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0.0) 0%, rgba(0, 0, 0, 0.0) 50%, rgba(0, 0, 0, 0.0) 90%, rgba(0, 0, 0, 0.0) 100%)",
                    backgroundUrl(croppedUrl)
                ].join(", ")
            }} >

            </motion.div>

            <div className="overflow-hidden">
                <motion.div
                    className={mergeClasses(
                        "flex flex-col w-full items-stretch",
                        "gap-6 pt-8 px-2",
                        folded && "overflow-hidden"
                    )}
                    initial={{ height: "0" }}
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

                    <div className={mergeClasses(
                        "flex flex-col items-stretch",
                        "mt-4"
                    )}>
                        <div className="text-2xl font-bold">Fiche technique</div>

                        <div className={mergeClasses(
                            "grid",
                            "grid-cols-[auto_auto_auto]",
                            "font-semibold",
                            "p-4 gap-x-6 gap-y-2"
                        )}>
                            {ficheElements.map(([label, value, colSpan]) => {
                                return <div
                                    key={label} className="flex flex-col"
                                    style={{
                                        gridColumn: `span ${colSpan}`,
                                    }}
                                >
                                    <div className="text-golden/40">{label}</div>
                                    <div className="font-semibold">{value}</div>
                                </div>
                            })}
                        </div>
                    </div>

                    {teaser && <iframe
                        className="w-full aspect-[4/3]"
                        src={teaser}
                        title="Teaser"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen={true}
                    />}
                    
                    <div className="text-white">{paragraph1}</div>
                    <div className="text-white">{paragraph2}</div>
                    <div className="text-white">{paragraph3}</div>

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

const SpectacleCard_Large = (props: SpectacleCardProps) => {
    const {
        spectacle: {
            name,
            ficheTechnique: {
                creation,
                duree,
                artistes,
                genres
            },
            description: {
                paragraph1,
                paragraph2,
                paragraph3,
            },
            affiche,
            teaser,
            socials: {
                billetreduc
            },
            gallery
        }
    } = props;

    const ficheElements: [string, string, number][] = [
        ["Création", creation, 1],
        ["Durée", duree, 1],
        ["Artistes", artistes, 1],
        ["Genres", genres, 3],
    ]

    const [folded, setFolded] = useState(true);

    const croppedUrl = croppedImageUrl(affiche.url, affiche.cropArea);

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "border-t border-golden",
        "py-6 lg:py-10",
        "px-6 lg:px-12",
        "gap-6 lg:gap-10",
        "overflow-hidden",
    )}>
        <div className={mergeClasses(
            "grid grid-cols-3",
            "gap-6 lg:gap-10",
        )}>
            <div className={mergeClasses(
                "flex flex-col items-stretch justify-between",
            )}>
                <motion.div
                    className={mergeClasses(
                        "text-white uppercase font-bold",
                        "text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
                    )}
                    animate={{
                        width: folded ? "100%" : "200%"
                    }}
                    initial={{
                        width: "100%"
                    }}
                    transition={{
                        duration: 0.05,
                        delay: folded ? 0. : 0.12
                    }}
                >
                    {name}
                </motion.div>
                <motion.div
                    animate={{
                        translateX: folded ? 0 : "90%"
                    }}
                    initial={{
                        translateX: 0
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                >
                    <TextButton
                        className={mergeClasses(
                            "pb-4 text-lg",
                        )}
                        onClick={() => setFolded(!folded)}
                    >
                        {folded ? "Consulter la fiche" : "Replier la fiche"}
                    </TextButton>
                </motion.div>
            </div>
            <motion.div className={mergeClasses(
                "text-white"
            )} animate={{
                opacity: folded ? 1 : 0
            }} initial={{
                opacity: 1
            }}>
                {paragraph1}
            </motion.div>
            <div className={mergeClasses(
                "bg-cover bg-center bg-no-repeat",
                "aspect-[4/3]"
            )} style={{
                backgroundImage: backgroundUrl(croppedUrl)
            }}/>
        </div>

        <div className="overflow-hidden">
            <motion.div className={mergeClasses(
                "w-full",
                "grid grid-cols-3",
                "gap-6 lg:gap-10",
            )} animate={{
                height: folded ? 0 : "auto",
            }} initial={{
                height: 0
            }}>

                <div className={mergeClasses(
                    "grid",
                    "grid-cols-3",
                    "grid-rows-[repeat(3,auto)]",
                    "font-semibold",
                    "px-3",
                    "gap-y-4"
                )}>
                    <div className={mergeClasses(
                        "col-span-3",
                        "text-2xl font-bold",
                    )}>
                        Fiche technique
                    </div>
                    {ficheElements.map(([label, value, colSpan]) => {
                        return <div
                            key={label} className="flex flex-col"
                            style={{
                                gridColumn: `span ${colSpan}`,
                            }}
                        >
                            <div className="text-golden/40">{label}</div>
                            <div className="font-semibold">{value}</div>
                        </div>
                    })}
                </div>
                
                <div />

                <div className={mergeClasses()}>
                    {teaser && <iframe
                        className="w-full aspect-[4/3]"
                        src={teaser}
                        title="Teaser"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen={true}
                    />}
                </div>


                <div className={mergeClasses(
                    "p-3",
                    "text-white",
                )}>
                    {paragraph1}
                </div>
                <div className={mergeClasses(
                    "p-3",
                    "text-white",
                )}>
                    {paragraph2}
                </div>
                <div className={mergeClasses(
                    "p-3",
                    "text-white",
                    "bg-golden/30"
                )}>
                    {paragraph3}
                </div>

                <div className={mergeClasses(
                    "col-span-3",
                    
                )}>
                    <Gallery_Large gallery={gallery} />
                </div>

                <div className={mergeClasses(
                    "flex items-center justify-center",
                    "col-span-3",
                )}>
                    <TextButton
                        className={mergeClasses(
                            "text-lg"
                        )}
                        onClick={() => setFolded(true)}
                    >
                        Replier la fiche
                    </TextButton>
                </div>
                

            </motion.div>
        </div>
    </div>
}

type GalleryProps = {
    gallery: EcorcesSpectacle["gallery"]
}

const Gallery_Small = (props: GalleryProps) => {
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



const Gallery_Large = (props: GalleryProps) => {

    const {
        gallery
    } = props;

    const [display, setDispay] = useState(false);
    const [index, setIndex] = useState<number>(0);

    const displayedImg = gallery[index];

    return <div className={mergeClasses(
        "grid",
        "grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6",
        "gap-6"
    )}>
        <motion.div className={mergeClasses(
            "fixed inset-0 z-50",
            "bg-black/50",
            (!display) && "pointer-events-none",
            "backdrop-blur-sm"
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