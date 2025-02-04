"use client";

import { useRef, useState } from "react"
import { mergeClasses } from "../../lib/utils"
import { useElementSize } from "../../lib/hooks"
import { uiBreakPoints } from "../ui/ecorces-ui";
import { NewsLetter } from "../ui/newsletter";
import Link from "next/link";
import { TextLink } from "../ui/text-link";
import { siteMakers, socialNetworks } from "../../lib/res";

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

    <NewsLetter className="mb-2" />
    <ContactBlock />
    <SocialBlock_Small />
    <MentionsLegales />

</div>

const Footer_Large = (props: InnerFooterProps) => <div>
    FOOTER_LARGE
</div>

const ContactBlock = () => <div className={mergeClasses(
    "flex flex-col gap-2 px-2 py-2",
    "border-t border-t-golden"
)} >
    <Link href="mailto:lesecorces@gmail.com"><div className="italic">lesecorces@gmail.com</div></Link>
    <Link href="tel:+33648031610"><div className="italic">+33 6 48 03 16 10</div></Link>
    <Link href="/espace-pro"><div className="italic">Espace professionnels</div></Link>
</div>

const SocialBlock_Small = () => <div className={mergeClasses(
    "flex flex-row items-center justify-evenly",
    "border-t border-t-golden border-b border-b-golden p-2 font-bold"
)}>
    <TextLink href={socialNetworks.instagram} emphasis={false}>Instagram</TextLink>
    <TextLink href={socialNetworks.facebook} emphasis={false}>Facebook</TextLink>
    <TextLink href={socialNetworks.youtube} emphasis={false}>Youtube</TextLink>
</div>

const MentionsLegales = () => <div className={mergeClasses(
    "flex flex-col items-start px-2 gap-2 py-2"
)}>
    <div>©{new Date().getFullYear()} Les Écorcés
    </div>
    <TextLink href="/mentions-legales" emphasis={false} className="text-sm">Mentions légales</TextLink>
    <div className="italic opacity-70 text-xs">Site désigné dans la joie par <Link href={siteMakers.loupLacaille}>Loup Lacaille</Link>...</div>
    <div className="italic opacity-70 text-xs">... et développé dans la bonne humeur par <Link href={siteMakers.pierreLemmel}>Pierre Lemmel</Link>.</div>
    <div className="italic opacity-70 text-xs">Crédits photo <Link href={siteMakers.janisAroling}>Janis Aroling</Link> et <Link href={siteMakers.christianDeHericourt}>Christian De Héricourt</Link></div>
</div>