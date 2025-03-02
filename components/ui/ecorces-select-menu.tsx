import React from "react";
import { mergeClasses } from "../../lib/utils";
import { base } from "framer-motion/client";
import { baseUiInputClasses } from "./ecorces-ui";

type EcorcesSelectMenuProps<T extends string = string> = {
    options: ({ value: T; label: string }|T)[];
    placeholder?: T;
    value?: T;
    onChange: (value: T) => void;
    className?: string;
    disabled?: boolean;
};

function EcorcesSelectMenu<T extends string = string>(props: EcorcesSelectMenuProps<T>) {

    const {
        options,
        placeholder = "Sélectionnez une option",
        value,
        onChange,
        className,
        disabled = false,
    } = props;
    
    return <div className={mergeClasses(
        className
    )}>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            disabled={disabled}
            className={mergeClasses(
                "w-full",
                baseUiInputClasses,
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            <option value="" disabled hidden className="text-black">
                {placeholder}
            </option>
            {options.map((option) => {

                const {
                    value,
                    label
                } = typeof option === "string" ? { value: option, label: option } : option;

                return <option
                    className={"text-black"}
                    key={value}
                    value={value}
                >
                    {label}
                </option>
            })}
        </select>
    </div>
};

export default EcorcesSelectMenu;