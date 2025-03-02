import { pathCombine } from "../lib/files";
import { deleteDocument, getDocument, listDocuments, setDocument } from "../lib/firebase";
import { EcorcesImage } from "./server";

export type EcorcesSpectacle = {
    name: string;

    ficheTechnique: {
        creation: string;
        duree: string;
        artistes: string;
        age: string;
        genres: string;
    };

    affiche: EcorcesImage;
    teaser?: string;

    description: {
        paragraph1: string;
        paragraph2: string;
        paragraph3: string;
    };

    socials: {
        billetreduc?: string;
    };

    gallery: EcorcesImage[];
}

type EcorcesSpectacleIndex = {
    spectacles: string[];
}

const pathToSpectacle = (name: string) => pathCombine("spectacles", name);

export async function listSpectacles(): Promise<string[]> {
    const docs = await listDocuments("spectacles");

    const ids = docs.filter(doc => doc !== "index");

    return ids;
}

export async function getSpectacle(name: string): Promise<EcorcesSpectacle> {
    const path = pathToSpectacle(name);

    const spectacle = await getDocument<EcorcesSpectacle>(path);

    return spectacle;
}

export async function saveSpectacle(spectacle: EcorcesSpectacle): Promise<EcorcesSpectacle> {
    const path = pathToSpectacle(spectacle.name);

    await setDocument(path, spectacle);

    return spectacle;
}

export async function deleteSpectacle(name: string) {
    const path = pathToSpectacle(name);

    await deleteDocument(path);
}

export function duplicateSpectacle(spectacle: EcorcesSpectacle): EcorcesSpectacle {

    const newName = spectacle.name + " (copie)";

    const result = structuredClone(spectacle);
    result.name = newName;

    return result;
}

export async function getSpectacleIndex(): Promise<string[]> {
    const path = pathToSpectacle("index");
    const doc = await getDocument<EcorcesSpectacleIndex>(path);

    return doc.spectacles;
}