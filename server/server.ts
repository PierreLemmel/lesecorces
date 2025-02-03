import { Timestamp } from "firebase/firestore";
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


export const allActivityTypes = [
    "Spectacle",
    "Stage",
    "Actualité"
] as const
export type ActiviteType = typeof allActivityTypes[number];


export const allActiviteVilles = [
    "Lyon",
    "Paris",
    "Autre"
] as const;
export type ActiviteVille = typeof allActiviteVilles[number];

export type EcorcesActivite = {
    type: ActiviteType;
    title: string;
    date: Timestamp;
    endDate?: Timestamp;
    city: ActiviteVille;
    description: string;
    banneer?: {
        url: string;
        cropArea: {
            x: number,
            y: number,
            width: number,
            height: number
        }
    }
    link?: string;
    full: boolean;
    visible: boolean;
}

export function createEmptyActivite(): EcorcesActivite {

    return {
        type: "Spectacle",
        title: "Nouvelle activité",
        date: Timestamp.now(),
        city: "Lyon",
        description: "",
        full: false,
        visible: false
    }
}

type ActivitesDbModel = {
    activites: EcorcesActivite[];
}

const pathToActivites = () => pathCombine("activites", "default");

export async function getActivites(): Promise<EcorcesActivite[]> {

    const path = pathToActivites();

    const data = await getDocument<ActivitesDbModel>(path);

    return data.activites;
}

export async function getUpcomingActivites(): Promise<EcorcesActivite[]> {

    const activites = await getActivites();

    const now = Timestamp.now();

    const result = activites.filter(activite => {
        return activite.date > now;
    })

    return result;
}

export async function saveActivites(activites: EcorcesActivite[]): Promise<boolean> {

    const path = pathToActivites();
    console.log("Saving activites", activites);
    await setDocument<ActivitesDbModel>(path, { activites }, true);

    return true;
}