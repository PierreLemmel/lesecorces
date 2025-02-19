'use client';

import { useEffect, useRef, useState } from "react";
import { mergeClasses } from "../../lib/utils"
import Link from "next/link";
import { faBars, faSquareXmark } from '@fortawesome/free-solid-svg-icons'
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
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


const MAX_SCROLL_SMALL = 100;

const MainMenu_Small = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { scrollY } = useScroll();
    const [scroll, setScroll] = useState<number>(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const newScroll = Math.min(latest / MAX_SCROLL_SMALL, 1);
        setScroll(newScroll);
    });

    return <motion.div className={mergeClasses(
            "fixed left-0 z-50 w-full",
            "flex flex-col items-stretch",
            !isOpen && "pointer-events-none",
            (scroll !== 1) && "border-t border-golden",    
        )}
        style={{
            transform: `translateY(${(1 - scroll) * 1.3}rem)`,
        }}
    >
        <motion.div
            className={mergeClasses(
                "w-screen h-screen fixed top-0 left-0 bg-black -z-10",
            )}
            animate={{
                opacity: isOpen ? 0.75 : 0,
            }}
            
        />

        <div className={mergeClasses(
            "flex justify-between items-center",
            "py-2 px-4",
            "bg-gradient-to-b from-black to-black/40",
            "pointer-events-auto"
        )}>
            <Link href="/">
                <div className="uppercase">Les Écorcés</div>
            </Link>
            <EcorcesIcon
                icon={isOpen ? faSquareXmark : faBars}
                onClick={() => setIsOpen(!isOpen)}
            />
        </div>
        <div className={mergeClasses(
            "overflow-hidden",
        )}>
            <motion.div
                className={mergeClasses(
                    "pr-3"
                )}
                initial={{
                    transform: "translateY(-100%)",
                }}
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
                        onClick={() => setIsOpen(false)}
                    >
                        {label}
                    </MenuElement_Small>)}
                </div>
            </motion.div>
        </div>
    </motion.div>
}


type MenuElement_SmallProps = {
    href: string;
    children: string;
    onClick: () => void;
}

const MenuElement_Small = (props: MenuElement_SmallProps) => {
    const {
        href,
        children,
        onClick
    } = props;

    return <Link
        href={href}
        className="hover:scale-110 transition-transform"
        onClick={onClick}
    >
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