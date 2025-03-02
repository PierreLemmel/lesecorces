"use client";

import { Dispatch, useCallback, useState } from "react";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useEffectAsync } from "../../../lib/hooks";
import EcorcesButton from "../../../components/ui/ecorces-button";
import EcorcesTextInput from "../../../components/ui/ecorces-text-input";
import { EcorcesLabel } from "../../../components/ui/ecorces-label";
import { mergeClasses } from "../../../lib/utils";
import { EcorcesContact, saveContacts, getContacts, duplicateContact } from "../../../server/contacts";
import EcorcesCheckbox from "../../../components/ui/ecorces-checkbox";
import { layoutClasses } from "../../../components/ui/ecorces-ui";


const CONTACTS_COLLECTION = "espace-pro";

const EcorcesContactManager = () => {
    const [contacts, setContacts] = useState<EcorcesContact[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commitChanges = useCallback(async () => {
        try {
            setIsSaving(true);
            const updated = await saveContacts(contacts, CONTACTS_COLLECTION);
            setContacts(updated);
            setIsSaving(false);
        }
        catch (err: any) {
            setError(err.toString());
        }
    }, [contacts]);


    useEffectAsync(async () => {
        try {
            setIsLoading(true);
            const allContacts = await getContacts(CONTACTS_COLLECTION);
            setContacts(allContacts);
            setIsLoading(false);
        }
        catch (err: any) {
            setError(err.toString());
        }
    }, [])

    if (error) {
        return <div>
            <div>Erreur : {error}</div>
        </div>;
    }

    if (isLoading) {
        return <div>
            <div>Chargement...</div>
            <LoadingSpinner />
        </div>;
    }

    if (isSaving) {
        return <div>
            <div>Sauvegarde...</div>
            <LoadingSpinner />
        </div>;
    }

    const props: ContactsEditionProps = {
        contacts,
        setContacts,
        commitChanges
    }

    return <ContactsEdition {...props} />;
};


type ContactForm = EcorcesContact;

const createEmptyForm = (): ContactForm => ({
    title: "Role",
    name: "Nouveau Contact",
    tel: "06 01 02 03 04",
    email: "lesecorces@gmail.com",
    visible: true
});

type ContactsEditionProps = {
    contacts: EcorcesContact[];
    setContacts: Dispatch<EcorcesContact[]>;
    commitChanges: () => Promise<void>;
}

const ContactsEdition = (props: ContactsEditionProps) => {

    const {
        contacts,
        setContacts,
        commitChanges,
    } = props;

    const [form, setForm] = useState<ContactForm>(createEmptyForm());
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [modified, setModified] = useState(false);


    const handleChange = (key: keyof EcorcesContact, value: any) => {
        setModified(true);
        setForm((prev) => {
            const base: ContactForm = prev ?? createEmptyForm();
            const result = { ...base, [key]: value };

            return result;
        });
    };

    const handleSave = () => {

        const newContact: EcorcesContact = structuredClone(form);

        if (editingIndex !== null) {
            const updatedContacts = [...contacts];
            updatedContacts[editingIndex] = newContact;
            setContacts(updatedContacts);
        } else {
            setContacts([...contacts, newContact]);
        }
        setForm(createEmptyForm());
        setEditingIndex(null);
    };

    const handleEdit = (index: number) => {
        setForm(contacts[index]);
        setEditingIndex(index);
    };

    const handleDelete = (index: number) => {
        setModified(true);
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
    };

    const handleDuplicate = (index: number) => {

        const newContact = duplicateContact(contacts[index]);
        setContacts([...contacts, newContact]);
        setForm(newContact);
        setEditingIndex(contacts.length);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm(createEmptyForm());
    }

    return <div className="w-full">
        <div className="flex flex-row justify-between items-center mb-6">
            <div className={mergeClasses(layoutClasses.heading1)}>Contacts</div>
            <EcorcesButton
                onClick={commitChanges}
                disabled={!modified}
            >
                Sauvegarder
            </EcorcesButton>
        </div>

        <div className="mb-6">
            {contacts.length === 0 ? (
                <p className="">Aucun contact pour l&apos;instant, c&apos;est triste 😢</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {contacts.map((partner, index) => <ContactCard
                        key={`Contact-${index.toString().padStart(2, "0")}`}
                        contact={partner}
                        handleEdit={() => handleEdit(index)}
                        handleDelete={() => handleDelete(index)}
                        handleDuplicate={() => handleDuplicate(index)}
                    />)}
                </div>
            )}
        </div>

        <div className="p-4 border rounded flex flex-col items-stretch">
            <h2 className="text-xl font-bold mb-4">
                {editingIndex !== null ? "Modifier un contact" : "Ajouter un contact"}
            </h2>
            <div className="space-y-4">
                <div>
                    <EcorcesLabel>Titre</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Rôle du contact"
                        value={form.title}
                        setValue={val => handleChange("title", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Nom</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Nom du contact"
                        value={form.name}
                        setValue={val => handleChange("name", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Email</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Email du contact"
                        value={form.email}
                        setValue={val => handleChange("email", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Téléphone</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Téléphone du contact"
                        value={form.tel}
                        setValue={val => handleChange("tel", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Visible</EcorcesLabel>
                    <EcorcesCheckbox
                        checked={form.visible}
                        onChange={val => handleChange("visible", val)}
                    />
                </div>
            </div>
            <div className="mt-4 flex space-x-2">
                <EcorcesButton
                    onClick={handleSave}
                >
                    Sauvegarder
                </EcorcesButton>
                <EcorcesButton
                    onClick={handleCancel}
                >
                    Annuler
                </EcorcesButton>
            </div>
        </div>
    </div>
}


type ContactCardProps = {
    contact: EcorcesContact;
    handleEdit: () => void;
    handleDelete: () => void;
    handleDuplicate: () => void;
}

const ContactCard = (props: ContactCardProps) => {

    const {
        contact: {
            title,
            name,
            email,
            tel,
            visible
        },
        handleEdit,
        handleDelete,
        handleDuplicate
    } = props;

    return (
        <div 
            className="p-4 border rounded shadow-sm flex flex-col justify-between"
        >
            <div className={mergeClasses(
                "flex flex-col text-gray-300",
                "relative",
                "p-3",
                "flex-grow"
            )}>
                <div className="font-bold text-xl text-golden">{title} {visible ? "": "(Inactif)"}</div>
                <div className="text-sm italic mb-2">{name}</div>
                <div className="">{email}</div>
                <div className="">{tel}</div>
            </div>

            <div className="flex flex-row mt-4 space-x-2">
                <EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
                <EcorcesButton onClick={handleDelete}>Supprimer</EcorcesButton>
                <EcorcesButton onClick={handleDuplicate}>Dupliquer</EcorcesButton>
            </div>
        </div>
    );
}

export default EcorcesContactManager;