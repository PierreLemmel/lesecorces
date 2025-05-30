"use client";

import { useRef, useState } from "react"
import { mergeClasses } from "../../lib/utils"
import { useElementSize } from "../../lib/hooks"
import { mainMenuItems, uiBreakPoints } from "../ui/ecorces-ui";
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
    "pt-3 gap-1",
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

const Footer_Large = (props: InnerFooterProps) => <div className={mergeClasses(
    "grid grid-cols-3",
    "px-2 sm:px-6 md:px-12",
    "pb-8 gap-6"
)}>
    <div className={mergeClasses(
        "border-t border-golden",
        "pt-1"
    )}>
        <SocialContent />
    </div>
    <div className={mergeClasses(
        "flex flex-col items-center",
        "border-t border-golden",
        "pt-1"
    )}>
        <div className="uppercase font-bold text-3xl">Les Écorcés</div>
        <div className={mergeClasses(
            "bg-no-repeat bg-contain bg-center",
            "w-full h-[5.5rem]"
        )}
            style={{
                backgroundImage: 'url("/img/misc/footer-anim.gif")'
            }}
        />
    </div>
    <div className={mergeClasses(
        "flex flex-col items-end",
        "border-t border-golden",
        "pt-1 px-1 gap-1"
    )}>
        {mainMenuItems.map(({ href, label }, index) => <TextLink
            key={`Footer-Menu-0${index}`}
            href={href}
        >
            {label}
        </TextLink>)}
    </div>

    <div className={mergeClasses(
        "border-t border-golden",
        "pt-1"
    )}>
        <MentionsContent />
    </div>
    <div className={mergeClasses(
        "border-t border-golden",
        "pt-1"
    )}>
        <NewsLetter />
    </div>
    <div className={mergeClasses(
        "flex flex-col items-end",
        "border-t border-golden",
        "pt-1 px-1 gap-1"
    )}>
        <SocialContent />
    </div>
</div>

const ContactBlock = () => <div className={mergeClasses(
    "flex flex-col gap-2 px-2 py-2",
    "border-t border-t-golden"
)} >
    <ContactContent />
</div>


const SocialBlock_Small = () => <div className={mergeClasses(
    "flex flex-row items-center justify-evenly",
    "border-t border-t-golden border-b border-b-golden p-2 font-bold"
)}>
    <SocialContent />
</div>

const MentionsLegales = () => <div className={mergeClasses(
    "flex flex-col items-start px-2 gap-2 py-2"
)}>
    <MentionsContent />
</div>


const ContactContent = () => <>
    <Link href="mailto:lesecorces@gmail.com"><div className="italic">lesecorces@gmail.com</div></Link>
    <Link href="tel:+33648031610"><div className="italic">+33 6 48 03 16 10</div></Link>
    <Link href="/espace-pro"><div className="italic">Espace professionnels</div></Link>
</>

const SocialContent = () => <>
    <TextLink href={socialNetworks.instagram}>Instagram</TextLink>
    <TextLink href={socialNetworks.facebook}>Facebook</TextLink>
    <TextLink href={socialNetworks.youtube}>Youtube</TextLink>
</>

const MentionsContent = () => <>
    <div>
        ©{new Date().getFullYear()} Les Écorcés
    </div>
    <TextLink href="/mentions-legales" className="text-sm">Mentions légales</TextLink>
    <div className="italic opacity-70 text-xs">Site désigné dans la joie par <Link className="underline" href={siteMakers.loupLacaille}>Loup Lacaille</Link>...</div>
    <div className="italic opacity-70 text-xs">... et développé dans la bonne humeur par <Link className="underline" href={siteMakers.pierreLemmel}>Pierre Lemmel</Link>.</div>
    <div className="italic opacity-70 text-xs">
        Crédits photo <Link className="underline" href={siteMakers.janisAroling}>Janis Aroling</Link>, <Link className="underline" href={siteMakers.laureDegroote}>Laure Degroote</Link> et <Link className="underline" href={siteMakers.christianDeHericourt}>Christian De Héricourt</Link>
    </div>
</>