"use client";

import { useRef, useState } from "react"
import Image from "next/image"
import { mergeClasses } from "../../lib/utils"
import { useElementSize } from "../../lib/hooks"
import { uiBreakPoints } from "../ui/ecorces-ui";
import TextInput from "../ui/text-input";
import { NewsLetter } from "../ui/newsletter";
import Link from "next/link";

export type FooterProps = {

}

export const Footer = (props: FooterProps) => {

    const [width, setWidth] = useState<number>(0)

    const rootRef = useRef<HTMLDivElement>(null)
    useElementSize(rootRef, ({ width }) => setWidth(width))

    return <div
        ref={rootRef}
    >
        {width > uiBreakPoints.md ? <Footer_Large /> : <Footer_Small />}
    </div>
}

type InnerFooterProps = {
    
}

const Footer_Small = (props: InnerFooterProps) => <div className={mergeClasses(
    "w-full flex flex-col items-stretch",
    "mt-2 pt-3 gap-1",
    "border-t border-t-golden"
)}>
    <div className="uppercase text-center font-bold">Les Écorcés</div>

    <div className="center-child h-[3rem] bg-no-repeat bg-contain bg-center"
        style={{
            backgroundImage: 'url("/img/misc/footer-anim.gif")'
        }}
    />

    <NewsLetter />
    <ContactBlock />
    <MentionsLegales />

</div>

const Footer_Large = (props: InnerFooterProps) => <div>
    FOOTER_LARGE
</div>

const ContactBlock = () => <div>
    <div>lesecorces@gmail.com</div>
    <div>+33 6 48 03 16 10</div>
    <div>Espace professionnels</div>
</div>

const MentionsLegales = () => <div className="flex flex-col items-start">
    <div>@{new Date().getFullYear()} Les Écorcés
    </div>
    <Link href="/mentionsl-legales">Mentions légales</Link>
    <div className="italic opacity-70 text-xs">Site désigné dans la joie par Loup Lacaille...</div>
    <div className="italic opacity-70 text-xs">... et développé dans la bonne humeur par Pierre Lemmel</div>
</div>