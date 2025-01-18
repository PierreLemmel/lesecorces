import { useCallback, useState } from "react";
import { emailRegex } from "./ecorces-ui";
import TextInput from "./text-input";
import { TextButton } from "./text-button";

const validateMail = (val: string) => {
    return val === "" || emailRegex.test(val);
}

export const NewsLetter = () => {

    const [mailEdit, setMailEdit] = useState("");
    const [mailToSend, setMailToSend] = useState<string>("");

    const onSubmitClicked = useCallback(() => {
        console.log("S'abonner! " + mailToSend);

        setMailEdit("");
        setMailToSend("");
    }, [mailToSend, setMailEdit, setMailToSend]);

    return <div className="flex flex-col gap-1 px-2">
        <div className="italic text-golden/80">Newsletter</div>
        <div className="flex flex-row justify-stretch gap-3">
            <TextInput
                value={mailEdit}
                setValue={setMailEdit}
                className="flex-grow"
                placeHolder="mail@gmail.com"
                validateValue={validateMail}
                errorMessage={"Mail invalide"}
                onValueCommitted={setMailToSend}
            />
            <TextButton onClick={onSubmitClicked}>S'abonner</TextButton>
        </div>
    </div>
}