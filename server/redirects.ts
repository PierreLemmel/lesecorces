import { pathCombine } from "../lib/files";
import { getDocument, setDocument } from "../lib/firebase";

export type EcorcesRedirect = {
    key: string;
    url: string;
}

type RedirectsDataModel = {
    [key: string]: string;
}

const pathToRedirects = () => pathCombine("links", "default");

export async function getRedirects(): Promise<EcorcesRedirect[]> {

    const path = pathToRedirects();

    const data = await getDocument<RedirectsDataModel>(path);

    const redirects: EcorcesRedirect[] = [];
    for (const key in data) {
        const url = data[key];
        redirects.push({ key, url });
    }

    return redirects;
}

export async function saveRedirects(redirects: EcorcesRedirect[]): Promise<EcorcesRedirect[]> {
    const path = pathToRedirects();

    const data: RedirectsDataModel = {};
    for (const redirect of redirects) {
        data[redirect.key] = redirect.url;
    }
    await setDocument<RedirectsDataModel>(path, data, true);

    return redirects;
}

export function duplicateRedirect(redirect: EcorcesRedirect) {
    const newName = redirect.key + "-copie";
    
    const result = structuredClone(redirect);
    result.key = newName;

    return result;
}