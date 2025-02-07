import { Timestamp } from "firebase/firestore";
import { pathCombine } from "../lib/files";
import { deleteDocument, documentExists, getDocument, listDocuments, setDocument } from "../lib/firebase";

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
    type: ActiviteType;
    ville: ActiviteVille;
}

export async function getActivites(params?: Partial<GetActivitesParams>): Promise<EcorcesActivite[]> {

    const {
        limit,
        upcoming = false,
        visible = false,
        type,
        ville
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

    if (type) {
        result = result.filter(activite => {
            return activite.type === type;
        })
    }

    if (ville) {
        result = result.filter(activite => {
            return activite.city === ville;
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

export type EcorcesBlock = {
    id: string;
    content: string;
    lastModified: Timestamp;
    history: {
        date: Timestamp;
        content: string;
    }[]
}


const pathToBlock = (blockId: string) => pathCombine("blocks", blockId);

export async function getBlock(blockId: string): Promise<EcorcesBlock> {
    
    const path = pathToBlock(blockId);

    return await getDocument<EcorcesBlock>(path);
}

export async function saveBlock(block: EcorcesBlock): Promise<EcorcesBlock> {
    
    const path = pathToBlock(block.id);

    await setDocument<EcorcesBlock>(path, block, true);

    return block;
}

export async function deleteBlock(blockId: string): Promise<void> {
    
    const path = pathToBlock(blockId);

    await deleteDocument(path);
}

export function createEmptyBlock(): EcorcesBlock {
    return {
        id: "NEW_BLOCK",
        content: "",
        lastModified: Timestamp.now(),
        history: []
    }
}

export function createBlock(id: string, content: string): EcorcesBlock {
    return {
        id,
        content,
        lastModified: Timestamp.now(),
        history: []
    }
}

export function duplicateBlock(block: EcorcesBlock): EcorcesBlock {
    console.log({
        ...block,
        id: block.id + "_COPIE"
    })
    return {
        ...block,
        id: block.id + "_COPIE"
    }
}

export function addVersionToBlock(block: EcorcesBlock, content: string): EcorcesBlock {
    return {
        id: block.id,
        content,
        lastModified: Timestamp.now(),
        history: [
            {
                date: Timestamp.now(),
                content: block.content
            },
            ...block.history,
        ]
    }
}

export async function listBlocksIds(): Promise<string[]> {
    const ids = await listDocuments("blocks");
    return ids;
}

export async function getBlockContent(id: string): Promise<string> {
    const block = await getBlock(id);
    return block.content;
}

export type EcorcesEcoleInfos = {
    cities: string;
    frequency: string;
    days: string;
    hours: number;
    shows: number;
    price: [number, number];
}

const pathToEcole = (name: string) => pathCombine("ecoles", name);

export async function getEcoleInfos(name: string): Promise<EcorcesEcoleInfos> {
    const path = pathToEcole(name);

    return await getDocument<EcorcesEcoleInfos>(path);
}