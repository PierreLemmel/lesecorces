import { pathCombine } from "../lib/files";
import { documentExists, getDocument, setDocument } from "../lib/firebase";

type NewsLetterData = {
    mails: string[];
}

export async function saveNewsLetterMail(mail: string): Promise<boolean> {

    const cleanMail = mail.trim().toLowerCase();

    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const path = pathCombine("newsletter", formattedDate);

    let data: NewsLetterData;
    if (await documentExists(path)) {
        data = await getDocument<NewsLetterData>(path);
    }
    else {
        data = {
            mails: []
        }
    }

    if (!data.mails.includes(cleanMail)) {
        data.mails.push(cleanMail);
    }

    await setDocument<NewsLetterData>(path, data);

    return true;
}