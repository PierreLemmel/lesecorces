import Link from "next/link";
import { mergeClasses } from "../../lib/utils";

export type TextLinkProps = {
    href: string;
    children: string;
    className?: string;
}
  
export const TextLink = (props: TextLinkProps) => {
    const {
        href,
        children,
        className = ''
    } = props

    return <Link href={href}>
        <div
            className={mergeClasses(
                "italic",
                "cursor-pointer hover:scale-110 transition-transform",
                className
            )}
        >
            {children}
        </div>
    </Link>
};