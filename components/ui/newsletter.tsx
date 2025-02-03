import { useCallback, useState } from "react";
import { emailRegex } from "./ecorces-ui";
import { TextButton } from "./text-button";
import { saveNewsLetterMail } from "../../server/server";
import { mergeClasses } from "../../lib/utils";
import EcorcesTextInput from "./ecorces-text-input";

const validateMail = (val: string) => {
    return val === "" || emailRegex.test(val);
}

export type NewsLetterProps = {
    className?: string;
}

export const NewsLetter = (props: NewsLetterProps) => {

    const {
        className
    } = props;

    const [mailEdit, setMailEdit] = useState("");
    const [mailToSend, setMailToSend] = useState<string>("");

    const [userMessage, setUserMessage] = useState<string|null>(null);

    const onSubmitClicked = useCallback(async () => {

        const success = await saveNewsLetterMail(mailToSend);

        if (success) {
            const successMsg = "💌 Vous avez bien été ajouté-e à la Newsletter !";
            setUserMessage(successMsg);
        }
        else {
            const failureMsg = "❌ Une erreur est survenue lors de l'enregistrement. Veuillez réessayer ultérieurement.";
            setUserMessage(failureMsg);
        }

        setMailEdit("");
        setMailToSend("");
    }, [mailToSend, setMailEdit, setMailToSend]);

    return <div className={mergeClasses(
        "flex flex-col gap-1 px-2",
        className
    )}>
        <div className="italic text-golden/80">Newsletter</div>
        <div className="flex flex-row items-stretch gap-4">
            <EcorcesTextInput
                value={mailEdit}
                setValue={setMailEdit}
                className="flex-grow-[2]"
                placeHolder="mail@gmail.com"
                validateValue={validateMail}
                errorMessage={"Mail invalide"}
                onValueCommitted={setMailToSend}
            />
            <TextButton
                onClick={onSubmitClicked}
                className="flex-grow text-center"
            >
                S&apos;abonner
            </TextButton>
        </div>
        {userMessage && <div className="text-white text-right text-sm mt-2">
            {userMessage}
        </div>}
    </div>
}