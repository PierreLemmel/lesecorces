'use client';

import { useRef, useEffect, useState } from "react";
import { mergeClasses } from "../../lib/utils"
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSquareXmark } from '@fortawesome/free-solid-svg-icons'
import { motion } from "framer-motion";
import { EcorcesIcon } from "../ui/icon";
import { useElementSize } from "../../lib/hooks";
import { uiBreakPoints } from "../ui/ecorces-ui";

export type MainMenuProps = {

}



const items = [
    {
        href: "/",
        label: "Accueil",
    },
    {
        href: "/spectacles",
        label: "Spectacles",
    },
    {
        href: "/compagnie",
        label: "Compagnie",
    },
    {
        href: "/ecole",
        label: "Offre pédagogique",
    },
    {
        href: "/espace-pro",
        label: "Espace Professionnels",
    },
]



const MainMenu = (props: MainMenuProps) => {

    const [width, setWidth] = useState<number>(0);

    const rootRef = useRef<HTMLDivElement>(null);
    useElementSize(rootRef, ({ width }) => setWidth(width))

    return <div className={mergeClasses(
        "w-full",
        "text-golden font-bold",
    )} ref={rootRef}>
        {width > uiBreakPoints.md ? <MainMenu_Large /> : <MainMenu_Small />}
    </div>
}


const MainMenu_Small = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return <div className={mergeClasses(
        "fixed top-[1.3rem] left-0 z-50 w-full",
        "flex flex-col items-stretch",
        "border-t border-golden",
    )}>
        <motion.div
            className={mergeClasses(
                "w-screen h-screen fixed top-0 left-0 bg-black -z-10",
                !isOpen && "pointer-events-none"
            )}
            animate={{
                opacity: isOpen ? 0.75 : 0,
            }}
            
        />

        <div className="flex justify-between items-center py-2 px-4">
            <Link href="/">
                <div className="uppercase">Les Écorcés</div>
            </Link>
            <EcorcesIcon
                icon={isOpen ? faSquareXmark : faBars}
                onClick={() => setIsOpen(!isOpen)}
            />
        </div>
        <div className="overflow-hidden">
            <motion.div
                className={mergeClasses(
                    "pr-3"
                )}
                animate={{
                    transform: isOpen ? "translateY(0)" : "translateY(-100%)",
                }}
            >
                <div className={mergeClasses(
                    "flex flex-col items-end gap-3",
                    "border-t border-golden pt-4"
                )}>
                    {items.map(({ href, label }, index) => <MenuElement_Small
                        key={`Menu-0${index}`}
                        href={href}
                    >
                        {label}
                    </MenuElement_Small>)}
                </div>
            </motion.div>
        </div>
    </div>
}


type MenuElement_SmallProps = {
    href: string;
    children: string;
}

const MenuElement_Small = (props: MenuElement_SmallProps) => {
    const {
        href,
        children
    } = props;

    return <Link href={href} className="hover:scale-110 transition-transform">
        {children}
    </Link>
} 

const MainMenu_Large = () => {
    return <div>
        Main Menu Large
    </div>
}


type MenuElement_LargeProps = {
    href: string;
    children: string;
}

const MenuElement_Large = (props: MenuElement_LargeProps) => {
    const {
        href,
        children
    } = props;

    return <Link href={href}>
        <div className="hover:text-white transition-colors duration-300">{children}</div>
    </Link>
} 

export default MainMenu;