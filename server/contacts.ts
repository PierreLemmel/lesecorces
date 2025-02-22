import { pathCombine } from "../lib/files";
import { getDocument, setDocument } from "../lib/firebase";

export type EcorcesContact = {
    title: string;
    name: string;
    tel: string;
    email: string;
    visible: boolean;
}

type ContactsDataModel = {
    contacts: EcorcesContact[];
}

const pathToContacts = (collection: string) => pathCombine("contacts", collection);

export async function getContacts(collection: string): Promise<EcorcesContact[]> {
    const path = pathToContacts(collection);

    const data = await getDocument<ContactsDataModel>(path);

    return data.contacts;
}

export async function saveContacts(contacts: EcorcesContact[], collection: string): Promise<EcorcesContact[]> {
    const path = pathToContacts(collection);

    await setDocument<ContactsDataModel>(path, { contacts }, true);

    return contacts;
}

export function duplicateContact(contact: EcorcesContact) {
    const newName = contact.name + " (copie)";
    
    const result = structuredClone(contact);
    result.name = newName;

    return result;
}