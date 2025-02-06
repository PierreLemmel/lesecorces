import React from "react";
import { mergeClasses } from "../../lib/utils";
import { ButtonSize, getButtonClasses } from "./ecorces-ui";
import { get } from "http";



export type EcorcesButtonProps = {
    children: React.ReactNode;
    onClick?: () => void|Promise<void>;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    size?: ButtonSize
};

const EcorcesButton = (props: EcorcesButtonProps) => {

    const {
        children,
        onClick,
        className,
        disabled = false,
        loading = false,
        size = "Normal"
    } = props;

    return <button
        onClick={onClick}
        disabled={disabled || loading}
        className={mergeClasses(
            getButtonClasses(size),
            (disabled || loading) && "opacity-50 cursor-not-allowed",
            className
        )}
    >
        {loading ?
        <span className="flex items-center justify-center">
            <svg
                className="w-5 h-5 mr-2 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
            ></path>
            </svg>
            Chargement...
        </span>
        : children}
    </button>
};

export default EcorcesButton;