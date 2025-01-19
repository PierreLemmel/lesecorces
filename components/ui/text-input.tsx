import React, { useState } from 'react';
import { mergeClasses } from '../../lib/utils';

export type TextInputProps = {
    value: string;
    setValue: (val: string) => void;

    placeHolder?: string;

    onValueCommitted?: (val: string) => void;

    validateValue?: (val: string) => boolean;
    errorMessage?: string| ((val: string) => string);

    className?: string;
}

const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
    const {
        value,
        setValue,
        placeHolder,
        onValueCommitted,
        validateValue,
        errorMessage,
        className
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
        "flex flex-col justify-start gap-1",
        className
    )}>
        <input
            className={mergeClasses(
                "bg-transparent border border-golden/50 focus:border-golden/70 focus:border-2 outline-0 focus:ring-0",
                "text-white/80 placeholder-white/40",
                "px-[0.35rem] py-[0.12rem] rounded-md"
            )}
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleValidation}
            placeholder={placeHolder}
        />
        {!isValid && <div>
            {errorMsg}
        </div>}
    </div>
};

export default TextInput;