"use client";

import { Dispatch, useCallback, useState } from "react";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useEffectAsync } from "../../../lib/hooks";
import EcorcesButton from "../../../components/ui/ecorces-button";
import { TextLink } from "../../../components/ui/text-link";
import EcorcesTextInput from "../../../components/ui/ecorces-text-input";
import { EcorcesLabel } from "../../../components/ui/ecorces-label";
import EcorcesImageUploader from "../../../components/ui/ecorces-image-uploader";
import { mergeClasses } from "../../../lib/utils";
import { backgroundUrl } from "../../../components/ui/ecorces-ui";
import { EcorcesPartenaire, savePartenaires, getPartenaires, duplicatePartenaire } from "../../../server/membres";
import { EcorcesImage } from "../../../server/server";
import EcorcesCheckbox from "../../../components/ui/ecorces-checkbox";


const EcorcesPartenaireManager = () => {
    const [partenaires, setPartenaires] = useState<EcorcesPartenaire[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commitChanges = useCallback(async () => {
        try {
            setIsSaving(true);
            const updated = await savePartenaires(partenaires);
            setPartenaires(updated);
            setIsSaving(false);
        }
        catch (err: any) {
            setError(err.toString());
        }
    }, [partenaires]);


    useEffectAsync(async () => {
        try {
            setIsLoading(true);
            const allPartenaires = await getPartenaires();
            setPartenaires(allPartenaires);
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

    const props: PartenairesEditionProps = {
        partenaires,
        setPartenaires,
        commitChanges
    }

    return <PartenairesEdition {...props} />;
};


type PartenaireForm = Omit<EcorcesPartenaire, "image"> & {
	image: EcorcesImage | undefined;
}

const createEmptyForm = (): PartenaireForm => ({ 
	name: "",
	role: "",
	projects: "",
	image: undefined,
    enabled: true,
	url: ""
});

type PartenairesEditionProps = {
    partenaires: EcorcesPartenaire[];
    setPartenaires: Dispatch<EcorcesPartenaire[]>;
    commitChanges: () => Promise<void>;
}

const PartenairesEdition = (props: PartenairesEditionProps) => {

    const {
        partenaires,
        setPartenaires,
        commitChanges,
    } = props;

    const [form, setForm] = useState<PartenaireForm>(createEmptyForm());
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [modified, setModified] = useState(false);


    const handleChange = (key: keyof EcorcesPartenaire, value: any) => {
        setModified(true);
        setForm((prev) => {
            const base: PartenaireForm = prev ?? createEmptyForm();
            const result = { ...base, [key]: value };

            return result;
        });
    };

    const handleSave = () => {
        if (form.image === undefined) {
            throw new Error("L'image est obligatoire");
        }

        const newPartenaire: EcorcesPartenaire = {
            ...form,
            image: form.image
        }

        if (editingIndex !== null) {
            const updatedPartenaires = [...partenaires];
            updatedPartenaires[editingIndex] = newPartenaire;
            setPartenaires(updatedPartenaires);
        } else {
            setPartenaires([...partenaires, newPartenaire]);
        }
        setForm(createEmptyForm());
        setEditingIndex(null);
    };

    const handleEdit = (index: number) => {
        setForm(partenaires[index]);
        setEditingIndex(index);
    };

    const handleDelete = (index: number) => {
        setModified(true);
        const updatedPartenaires = partenaires.filter((_, i) => i !== index);
        setPartenaires(updatedPartenaires);
    };

    const handleDuplicate = (index: number) => {

        const newActivity = duplicatePartenaire(partenaires[index]);
        setPartenaires([...partenaires, newActivity]);
        setForm(newActivity);
        setEditingIndex(partenaires.length);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm(createEmptyForm());
    }

    return <div className="w-full">
        <div className="flex flex-row justify-between items-center mb-6">
            <div className="heading-1">Partenaires</div>
            <EcorcesButton
                onClick={commitChanges}
                disabled={!modified}
            >
                Sauvegarder
            </EcorcesButton>
        </div>

        <div className="mb-6">
            {partenaires.length === 0 ? (
                <p className="">Aucun partenaire pour l&apos;instant, c&apos;est triste 😢</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {partenaires.map((partner, index) => <ActivityCard
                        key={`Partenaire-${index.toString().padStart(2, "0")}`}
                        partner={partner}
                        handleEdit={() => handleEdit(index)}
                        handleDelete={() => handleDelete(index)}
                        handleDuplicate={() => handleDuplicate(index)}
                    />)}
                </div>
            )}
        </div>

        <div className="p-4 border rounded flex flex-col items-stretch">
            <h2 className="text-xl font-bold mb-4">
                {editingIndex !== null ? "Modifier un partenaire" : "Ajouter un partenaire"}
            </h2>
            <div className="space-y-4">
                <div>
                    <EcorcesLabel>Nom</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Nom du partenaire"
                        value={form.name}
                        setValue={val => handleChange("name", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Rôle</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Rôle du partenaire"
                        value={form.role}
                        setValue={val => handleChange("role", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Projets</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Projets menés avec le partenaire"
                        value={form.projects}
                        setValue={val => handleChange("projects", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>{"Image"}</EcorcesLabel>
                    <EcorcesImageUploader
                        onUpload={f => handleChange("image", f)}
                        file={form.image}
                        hasCropping={false}
                        destinationFolder="partenaires"
                    />
                </div>
                <div>
                    <EcorcesLabel>Visible</EcorcesLabel>
                    <EcorcesCheckbox
                        checked={form.enabled}
                        onChange={val => handleChange("enabled", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Lien</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="www.google.com"
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


type ActivityCardProps = {
    partner: EcorcesPartenaire;
    handleEdit: () => void;
    handleDelete: () => void;
    handleDuplicate: () => void;
}

const ActivityCard = (props: ActivityCardProps) => {

    const {
        partner: {
            name,
            role,
            projects,
            image,
            enabled,
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
                <div className="font-bold text-xl text-golden">{name}{enabled ? "" : " (Masqué)"}</div>
                <div className="text-sm italic mb-2">{role}</div>
                <div className="">{projects}</div>
                <div className={mergeClasses(
                    "w-16 h-16 rounded-sm",
                    "bg-contain bg-center bg-no-repeat",
                    "bg-gray-500",
                )} style={{
                    backgroundImage: backgroundUrl(image.url)
                }}/>
                {url !== "" && <TextLink href={url} className="mt-2" target="_blank">
                    Visiter le lien
                </TextLink>}
            </div>

            <div className="flex flex-row mt-4 space-x-2">
                <EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
                <EcorcesButton onClick={handleDelete}>Supprimer</EcorcesButton>
                <EcorcesButton onClick={handleDuplicate}>Dupliquer</EcorcesButton>
            </div>
        </div>
    );
}

export default EcorcesPartenaireManager;