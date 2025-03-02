import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { mergeClasses } from "../../lib/utils";

export interface EcorcesIconProps extends FontAwesomeIconProps {
    icon: IconProp;
    maxSize?: string;
}

export const EcorcesIcon = (props: EcorcesIconProps) => {
    const {
        icon,
        className,
        onClick,
        maxSize = "2rem",
        ...restProps
    } = props;

    const clickable = onClick !== undefined;

    return <FontAwesomeIcon
        icon={icon}
        style={{
            maxHeight: maxSize
        }}
        className={mergeClasses(
            className,
            clickable && "hover:scale-110 transition-transform hover:cursor-pointer"
        )}
        onClick={onClick}
        {...restProps}
    />
}