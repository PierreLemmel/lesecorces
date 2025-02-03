import { mergeClasses } from "../../lib/utils";

export type EcorcesLabelProps = {
    children: React.ReactNode;
    className?: string;
}

export const EcorcesLabel = (props: EcorcesLabelProps) => {
    const {
        children,
        className
    } = props;

    return <label className={mergeClasses(
        "block text-sm font-medium",
        className
    )}>
        {children}
    </label>
}