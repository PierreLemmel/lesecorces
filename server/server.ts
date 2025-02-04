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

export type EcorcesBanneer = {
    url: string;
    cropArea: {
        x: number,
        y: number,
        width: number,
        height: number
    }
}

export type EcorcesActivite = {
    type: ActiviteType;
    title: string;
    date: Timestamp;
    endDate?: Timestamp;
    city: ActiviteVille;
    description: string;
    banneer?: EcorcesBanneer;
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

export function duplicateActivite(activite: EcorcesActivite): EcorcesActivite {

    return {
        ...activite,
        banneer: activite.banneer ? { ...activite.banneer } : undefined,
        title: activite.title + " (copie)",
    }
}

type ActivitesDbModel = {
    activites: EcorcesActivite[];
}

const pathToActivites = () => pathCombine("activites", "default");

export type GetActivitesParams = {
    limit: number;
    upcoming: boolean;
    visible: boolean;
}

export async function getActivites(params?: Partial<GetActivitesParams>): Promise<EcorcesActivite[]> {

    const {
        limit,
        upcoming = false,
        visible = false
    } = params || {};

    const path = pathToActivites();

    const data = await getDocument<ActivitesDbModel>(path);

    let result = data.activites;

    if (visible) {
        result = result.filter(activite => {
            return activite.visible;
        })
    }

    if (upcoming) {

        const now = Timestamp.now();
        result = result.filter(activite => {
            return activite.date > now;
        })

    }

    if (limit) {
        result = result.slice(0, limit);
    }

    return result;
}


export async function saveActivites(activites: EcorcesActivite[]): Promise<EcorcesActivite[]> {

    const path = pathToActivites();
    
    const sorted = activites.toSorted((a, b) => a.date.toMillis() - b.date.toMillis());
    
    await setDocument<ActivitesDbModel>(path, {
        activites: sorted
    }, true);

    return sorted;
}

export type EcorcesOffrePedagogique = {
    name: string;
    description: string;
    link?: string;
    full: boolean;
    visible: boolean;
}

const pathToOffresPedagogiques = () => pathCombine("offre-pedagogique", "default");

type OffrePedagogiqueDbModels = {
    offres: EcorcesOffrePedagogique[];
}

export async function getOffrePedagogique(): Promise<EcorcesOffrePedagogique[]> {

    const path = pathToOffresPedagogiques();

    const { offres } = await  getDocument<OffrePedagogiqueDbModels>(path);

    return offres;
}

export async function saveOffrePedagogique(offres: EcorcesOffrePedagogique[]): Promise<EcorcesOffrePedagogique[]> {
    
    const path = pathToOffresPedagogiques();

    await setDocument<OffrePedagogiqueDbModels>(path, {
        offres
    }, true);

    return offres;
}

export function createEmptyOffrePedagogique(): EcorcesOffrePedagogique {
    return {
        name: "Nouvelle offre",
        description: "",
        visible: false,
        full: false
    }
}

export function duplicateOffrePedagogique(offre: EcorcesOffrePedagogique): EcorcesOffrePedagogique {
    return {
        ...offre,
        name: offre.name + " (copie)"
    }
}