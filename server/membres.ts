import { pathCombine } from "../lib/files";
import { getDocument, setDocument, listDocuments, deleteDocument } from "../lib/firebase";
import { EcorcesImage } from "./server";

export type EcorcesMembre = {
    name: string;
    role: string;
    socials: {
        instagram?: string;
        facebook?: string;
        website?: string;
        soundcloud?: string;
    };
    description: {
        shortBio: string;
        paragraph1: string;
        paragraph2: string;
        paragraph3: string;
    }
    profilePicture: EcorcesImage;
    gallery: EcorcesImage[];
}

const pathToMembre = (name: string) => pathCombine("membres", name);

export async function getMembre(name: string): Promise<EcorcesMembre> {
    const path = pathToMembre(name);

    return await getDocument<EcorcesMembre>(path);
}

export async function saveMembre(membre: EcorcesMembre): Promise<EcorcesMembre> {
    const path = pathToMembre(membre.name);

    await setDocument<EcorcesMembre>(path, membre, true);

    return membre;
}

export async function listMembres(): Promise<string[]> {
    const ids = await listDocuments("membres");
    return ids;
}

export async function deleteMembre(name: string): Promise<void> {
    const path = pathToMembre(name);

    await deleteDocument(path);
}

export function duplicateMembre(membre: EcorcesMembre) {
    const newName = membre.name + " (copie)";
    
    const result = structuredClone(membre);
    result.name = newName;

    return result;
}



export type EcorcesAmi = {
    name: string;
    role: string;
    socials: {
        instagram?: string;
        facebook?: string;
        website?: string;
        soundcloud?: string;
    };
    projects: string;
    profilePicture: EcorcesImage;
}

const pathToAmi = (name: string) => pathCombine("amis", name);

export async function getAmi(name: string): Promise<EcorcesAmi> {
    const path = pathToAmi(name);

    return await getDocument<EcorcesAmi>(path);
}

export async function saveAmi(ami: EcorcesAmi): Promise<EcorcesAmi> {
    const path = pathToAmi(ami.name);

    await setDocument<EcorcesAmi>(path, ami, true);

    return ami;
}

export async function listAmis(): Promise<string[]> {
    const ids = await listDocuments("amis");
    return ids;
}

export async function deleteAmi(name: string): Promise<void> {
    const path = pathToAmi(name);

    await deleteDocument(path);
}

export function duplicateAmi(ami: EcorcesAmi) {
    const newName = ami.name + " (copie)";
    
    const result = structuredClone(ami);
    result.name = newName;

    return result;
}




export type EcorcesPartenaire = {
    name: string;
    role: string;
    projects: string;
    image: EcorcesImage;
    url: string;
    enabled: boolean;
}

type PartenairesDbModel = {
    partenaires: EcorcesPartenaire[];
}

const pathToPartenaires = () => pathCombine("partenaires", "default");

export type GetPartenairesOptions = {
    enabledOnly: boolean;
}

export async function getPartenaires(options: Partial<GetPartenairesOptions> = {}): Promise<EcorcesPartenaire[]> {

    const {
        enabledOnly = false
    } = options;

    const path = pathToPartenaires();
    let { partenaires } = await getDocument<PartenairesDbModel>(path);

    if (enabledOnly) {
        partenaires = partenaires.filter(p => p.enabled);
    }


    return partenaires;
}

export async function savePartenaires(partenaires: EcorcesPartenaire[]): Promise<EcorcesPartenaire[]> {
    const path = pathToPartenaires();

    await setDocument<PartenairesDbModel>(path, { partenaires }, true);

    return partenaires;
}

export function duplicatePartenaire(partenaire: EcorcesPartenaire) {
    const newName = partenaire.name + " (copie)";
    
    const result = structuredClone(partenaire);
    result.name = newName;

    return result;
}

