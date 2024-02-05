import { mergeClasses } from "../../lib/utils"
import Link from "next/link";

export type MainMenuProps = {

}

const MainMenu = (props: MainMenuProps) => {

    return <div className={mergeClasses(
        "flex flex-row w-full justify-end gap-6",
        "py-2 pr-4",
        "overflow-hidden"
    )}>
        <MenuElement href="/compagnie">
            La compagnie
        </MenuElement>
        <MenuElement href="/spectacles">
            Spectacles
        </MenuElement>
        <MenuElement href="/ecole">
            École
        </MenuElement>
        <MenuElement href="/contact">
            Contact
        </MenuElement>
    </div>
}

type MenuElementProps = {
    href: string;
    children: string;
}

const MenuElement = (props: MenuElementProps) => {
    const {
        href,
        children
    } = props;

    return <Link href={href}>
        <div className="hover:text-white transition-colors duration-300">{children}</div>
    </Link>
} 

export default MainMenu;