import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { mergeClasses } from "../../lib/utils";

export interface EcorcesIconProps extends FontAwesomeIconProps {
    icon: IconProp;
}

export const EcorcesIcon = (props: EcorcesIconProps) => {
    const {
        icon,
        className,
        onClick,
        ...restProps
    } = props;

    const clickable = onClick !== undefined;

    return <FontAwesomeIcon
        icon={icon}
        className={mergeClasses(
            className,
            clickable && "hover:scale-110 transition-transform hover:cursor-pointer"
        )}
        onClick={onClick}
        {...restProps}
    />
}