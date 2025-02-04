import Link from "next/link";
import { mergeClasses } from "../../lib/utils";

export type TextLinkProps = {
    href: string;
    children: string;
    className?: string;
    emphasis?: boolean;
    target?: "_blank";
}
  
export const TextLink = (props: TextLinkProps) => {
    const {
        href,
        children,
        className,
        emphasis = true,
        target
    } = props

    return <Link href={href} target={target}>
        <div
            className={mergeClasses(
                "italic",
                emphasis ? "font-semibold text-golden2" : "text-golden",
                "cursor-pointer hover:scale-105 transition-transform transform-gpu origin-center",
                className
            )}
        >
            {children}
        </div>
    </Link>
};