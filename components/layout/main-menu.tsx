'use client';

import { useRef, useState } from "react";
import { mergeClasses } from "../../lib/utils"
import { useElementSize } from "../../lib/hooks";
import { mainMenuItems, uiBreakPoints } from "../ui/ecorces-ui";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { faSquareXmark, faBars } from "@fortawesome/free-solid-svg-icons";
import { EcorcesIcon } from "../ui/icon";
import { TextLink } from "../ui/text-link";

export type MainMenuProps = {
    shadow?: boolean;
    floating?: boolean;
}

const tagline = "Vivez l'expérience unique de l'improvisation théâtrale avec Les Écorcés";

const defaultProps: Required<MainMenuProps> = {
    shadow: false,
    floating: false
}

const MainMenu = (props: MainMenuProps) => {

    const propsWithDefault: MainMenuProps = {
        ...defaultProps,
        ...props
    }

    const [width, setWidth] = useState<number>(0);

    const rootRef = useRef<HTMLDivElement>(null);
    useElementSize(rootRef, ({ width }) => setWidth(width))

    return <div className={mergeClasses(
        "w-full",
        "text-golden font-bold",
    )} ref={rootRef}>
        {width > uiBreakPoints.md ? <MainMenu_Large
            {...propsWithDefault}
        /> : ( width > 0 ? <MainMenu_Small
            {...propsWithDefault}
        /> : <></>)}
    </div>
}

const MAX_SCROLL_SMALL = 100;

const MainMenu_Small = (props: MainMenuProps) => {

    const {
        shadow
    } = props;

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
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: isOpen ? 0.75 : 0,
            }}
            
        />

        <div className={mergeClasses(
            "flex justify-between items-center",
            "py-2 px-4",
            shadow && "bg-gradient-to-b from-black to-black/40",
            "pointer-events-auto"
        )}>
            <Link href="/">
                <div className="uppercase">Les Écorcés</div>
            </Link>
            <EcorcesIcon
                className="text-2xl"
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
                    {mainMenuItems.map(({ href, label }, index) => <MenuElement_Small
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


const MainMenu_Large = (props: MainMenuProps) => {

    const {
        floating
    } = props;

    return <div className={mergeClasses(
        floating && "absolute top-0 left-0 w-full z-50",
        "grid grid-cols-3",
        "grid-cols-[2fr_2fr_1fr]",
        "gap-6 pt-6 px-12"
    )}>
        <div className={mergeClasses(
            "border-t border-golden",
            "px-2 pt-1",
        )}>
            Les Écorcés
        </div>
        
        <div className={mergeClasses(
            "border-t border-golden",
            "text-center",
            "px-4 pt-1"
        )}>
            {tagline}
        </div>
        
        <div className={mergeClasses(
            "flex flex-col items-stretch",
            "border-t border-golden",
            "px-2 pt-1",
        )}>
            {mainMenuItems.map(({ href, label }, index) => <MenuElement_Large
                key={`Menu-0${index}`}
                href={href}
            >
                {label}
            </MenuElement_Large>)}
        </div>
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

    return <TextLink
        className="text-right"
        href={href}
    >
        {children}
    </TextLink>
} 

export default MainMenu;