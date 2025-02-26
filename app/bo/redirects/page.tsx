"use client";

import { Dispatch, useCallback, useState } from "react";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useEffectAsync } from "../../../lib/hooks";
import EcorcesButton from "../../../components/ui/ecorces-button";
import EcorcesTextInput from "../../../components/ui/ecorces-text-input";
import { EcorcesLabel } from "../../../components/ui/ecorces-label";
import { mergeClasses } from "../../../lib/utils";
import { EcorcesRedirect, saveRedirects, getRedirects, duplicateRedirect } from "../../../server/redirects";
import { TextLink } from "../../../components/ui/text-link";
import { layoutClasses } from "../../../components/ui/ecorces-ui";


const EcorcesRedirectManager = () => {
    const [redirects, setRedirects] = useState<EcorcesRedirect[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commitChanges = useCallback(async () => {
        try {
            setIsSaving(true);
            const updated = await saveRedirects(redirects);
            setRedirects(updated);
            setIsSaving(false);
        }
        catch (err: any) {
            setError(err.toString());
        }
    }, [redirects]);


    useEffectAsync(async () => {
        try {
            setIsLoading(true);
            const allRedirects = await getRedirects();
            setRedirects(allRedirects);
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

    const props: RedirectsEditionProps = {
        redirects,
        setRedirects,
        commitChanges
    }

    return <RedirectsEdition {...props} />;
};


type RedirectForm = EcorcesRedirect;

const createEmptyForm = (): RedirectForm => ({
    key: "new-redirect",
    url: "https://www.google.com/"
});

type RedirectsEditionProps = {
    redirects: EcorcesRedirect[];
    setRedirects: Dispatch<EcorcesRedirect[]>;
    commitChanges: () => Promise<void>;
}

const RedirectsEdition = (props: RedirectsEditionProps) => {

    const {
        redirects,
        setRedirects,
        commitChanges,
    } = props;

    const [form, setForm] = useState<RedirectForm>(createEmptyForm());
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [modified, setModified] = useState(false);


    const handleChange = (key: keyof EcorcesRedirect, value: any) => {
        setModified(true);
        setForm((prev) => {
            const base: RedirectForm = prev ?? createEmptyForm();
            const result = { ...base, [key]: value };

            return result;
        });
    };

    const handleSave = () => {

        const newRedirect: EcorcesRedirect = structuredClone(form);

        if (editingIndex !== null) {
            const updatedRedirects = [...redirects];
            updatedRedirects[editingIndex] = newRedirect;
            setRedirects(updatedRedirects);
        } else {
            setRedirects([...redirects, newRedirect]);
        }
        setForm(createEmptyForm());
        setEditingIndex(null);
    };

    const handleEdit = (index: number) => {
        setForm(redirects[index]);
        setEditingIndex(index);
    };

    const handleDelete = (index: number) => {
        setModified(true);
        const updatedRedirects = redirects.filter((_, i) => i !== index);
        setRedirects(updatedRedirects);
    };

    const handleDuplicate = (index: number) => {

        const newRedirect = duplicateRedirect(redirects[index]);
        setRedirects([...redirects, newRedirect]);
        setForm(newRedirect);
        setEditingIndex(redirects.length);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm(createEmptyForm());
    }

    return <div className="w-full">
        <div className="flex flex-row justify-between items-center mb-6">
            <div className={mergeClasses(layoutClasses.heading1)}>Redirects</div>
            <EcorcesButton
                onClick={commitChanges}
                disabled={!modified}
            >
                Sauvegarder
            </EcorcesButton>
        </div>

        <div className="mb-6">
            {redirects.length === 0 ? (
                <p className="">Aucun redirect pour l&apos;instant, c&apos;est triste 😢</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {redirects.map((partner, index) => <RedirectCard
                        key={`Redirect-${index.toString().padStart(2, "0")}`}
                        redirect={partner}
                        handleEdit={() => handleEdit(index)}
                        handleDelete={() => handleDelete(index)}
                        handleDuplicate={() => handleDuplicate(index)}
                    />)}
                </div>
            )}
        </div>

        <div className="p-4 border rounded flex flex-col items-stretch">
            <h2 className="text-xl font-bold mb-4">
                {editingIndex !== null ? "Modifier un redirect" : "Ajouter un redirect"}
            </h2>
            <div className="space-y-4">
                <div>
                    <EcorcesLabel>Id</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Id de la redirection"
                        value={form.key}
                        setValue={val => handleChange("key", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Url</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Id de la redirection"
                        value={form.url}
                        setValue={val => handleChange("url", val)}
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


type RedirectCardProps = {
    redirect: EcorcesRedirect;
    handleEdit: () => void;
    handleDelete: () => void;
    handleDuplicate: () => void;
}

const RedirectCard = (props: RedirectCardProps) => {

    const {
        redirect: {
            key,
            url
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
                <div className="font-bold text-xl text-golden">{key}</div>
                <div className="">{url}</div>
                <TextLink href={url} target="_blank" className="text-golden">Tester le lien</TextLink>
            </div>

            <div className="flex flex-row mt-4 space-x-2">
                <EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
                <EcorcesButton onClick={handleDelete}>Supprimer</EcorcesButton>
                <EcorcesButton onClick={handleDuplicate}>Dupliquer</EcorcesButton>
            </div>
        </div>
    );
}

export default EcorcesRedirectManager;