import { mergeClasses } from "../../lib/utils";

export type TextButtonProps = {
    enabled?: boolean;
    children: string|JSX.Element;
    onClick: () => void;
    className?: string;
}
  
export const TextButton = (props: TextButtonProps) => {
    const {
        enabled = true,
        children,
        onClick,
        className = ''
    } = props

    return <div
        onClick={() => enabled && onClick()}
        className={mergeClasses(
            "italic text-golden2 font-semibold",
            enabled && "cursor-pointer origin-left hover:scale-105 transition-transform",
            className
        )}
    >
        {children}
    </div>
};