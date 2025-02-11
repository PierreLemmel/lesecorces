"use client";

import { motion } from "framer-motion";
import { mergeClasses } from "../../../lib/utils";
import { EcorcesMembre } from "../../../server/membres";
import { useEffect, useState } from "react";
import { EcorcesIcon } from "../../../components/ui/icon";
import { faFacebook, faInstagram, faSoundcloud } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { TextButton } from "../../../components/ui/text-button";
import IconSvg from "../../../components/ui/icon-svg";
import Link from "next/link";
import { getImageData } from "../../../components/ui/ecorces-ui";

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

    const [profileImgData, setProfileImgData] = useState<string>();
    useEffect(() => {
        getImageData(profilePicture.url, profilePicture.cropArea, (data) => {
            setProfileImgData(data);
        });
    })

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "px-2"
    )}>
        <div className="text-white text-2xl uppercase">{name}</div>
        <div className="text-white text-lg">{role}</div>
        
        <motion.div className={mergeClasses(
            "w-full aspect-square",
            "mt-4",
            "bg-cover bg-center bg-no-repeat bg-blend-multiply mix-blend-lighten",
        )} style={{
            backgroundImage: "linear-gradient(to left, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 1) 100%)" + (profileImgData ? `, url(${profileImgData})` : "")
        }}>
            
        </motion.div>
        
        <div className={mergeClasses(
            "flex flex-row items-center justify-center",
            "mt-3 gap-4"
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

        <div className={mergeClasses(
            "flex flex-col items-stretch",
            "gap-4 mt-8"
        )}>
            <TextButton
                onClick={() => setFolded(false)}
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

             <div>GALLERY</div>

             <TextButton
                onClick={() => setFolded(false)}
                className="text-center"
            >
                Replier la fiche
             </TextButton>
        </div>
    </div>
}