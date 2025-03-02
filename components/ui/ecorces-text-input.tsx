import React, { useState } from 'react';
import { mergeClasses } from '../../lib/utils';
import { baseUiInputClasses } from './ecorces-ui';

export type EcorcesTextInputProps = {
    value: string;
    setValue: (val: string) => void;

    placeHolder?: string;

    onValueCommitted?: (val: string) => void;

    validateValue?: (val: string) => boolean;
    errorMessage?: string| ((val: string) => string);

    className?: string;
    disabled?: boolean;
}

const TextInput = (props: EcorcesTextInputProps) => {
    const {
        value,
        setValue,
        placeHolder,
        onValueCommitted,
        validateValue,
        errorMessage,
        className,
        disabled = false
     } = props;

    const [isValid, setIsValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState('Erreur');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        
        setValue(newValue)

        setValue(newValue);
    };

    const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        if (onValueCommitted) {
            onValueCommitted(value);
        }

        if (validateValue && !validateValue(value)) {

            setIsValid(false);

            if (errorMessage) {
                const newErrorMsg = typeof errorMessage === "string" ?
                    errorMessage : 
                    errorMessage(value);

                setErrorMsg(newErrorMsg)
            }
        }
        else {
            setIsValid(true);
        }
    }

    return <div className={mergeClasses(
        "flex flex-col justify-start gap-1 ",
        className
    )}>
        <input
            className={mergeClasses(
                baseUiInputClasses,
                "px-[0.35rem] py-[0.12rem]",
                disabled && "cursor-not-allowed text-white/60"
            )}
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleValidation}
            placeholder={placeHolder}
            disabled={disabled}
        />
        {!isValid && <div>
            {errorMsg}
        </div>}
    </div>
};

export default TextInput;