import { mergeClasses } from "../../lib/utils";

export type TextButtonProps = {
    children: string;
    onClick: () => void;
    className?: string;
}
  
export const TextButton = (props: TextButtonProps) => {
    const {
        children,
        onClick,
        className = ''
    } = props

    return <div
        onClick={onClick}
        className={mergeClasses(
            "cursor-pointer text-blue-500 hover:underline ${className}",
            className
        )}
    >
        {children}
    </div>
};