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
            "italic",
            enabled && "cursor-pointer hover:scale-110 transition-transform",
            className
        )}
    >
        {children}
    </div>
};