import React from "react";
import { mergeClasses } from "../../lib/utils";

type EcorcesCheckboxProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
	disabled?: boolean;
};

const EcorcesCheckbox = (props: EcorcesCheckboxProps) => {
	const {
        checked,
        onChange,
        className = "",
        disabled = false
    } = props;


	return (
		<div className={mergeClasses(
            "flex items-center",
            disabled && "opacity-50 cursor-not-allowed",
            className
        )}>
			<input
				type="checkbox"
				checked={checked}
				disabled={disabled}
				onChange={(e) => onChange(e.target.checked)}
				className="hidden"
                />
			<div
				className={mergeClasses(
                    "border outline-0 rounded-md",
					"focus:border-golden/70 focus:border-2 focus:ring-0",
                    "w-5 h-5 cursor-pointer",
                    checked ?
						"bg-golden/70 border-golden" :
						"bg-white/20 border-golden/50"
                )}
				onClick={() => !disabled && onChange(!checked)}
			/>
		</div>
	);
};

export default EcorcesCheckbox;