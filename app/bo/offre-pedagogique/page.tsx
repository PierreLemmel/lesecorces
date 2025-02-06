"use client";

import { Dispatch, useCallback, useState } from "react";
import { useEffectAsync } from "../../../lib/hooks";
import { createEmptyOffrePedagogique, duplicateOffrePedagogique, EcorcesOffrePedagogique, getOffrePedagogique, saveOffrePedagogique } from "../../../server/server";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import EcorcesButton from "../../../components/ui/ecorces-button";
import { EcorcesLabel } from "../../../components/ui/ecorces-label";
import EcorcesTextInput from "../../../components/ui/ecorces-text-input";
import EcorcesCheckbox from "../../../components/ui/ecorces-checkbox";
import EcorcesTextArea from "../../../components/ui/ecorces-text-area";
import { TextLink } from "../../../components/ui/text-link";
import { mergeClasses } from "../../../lib/utils";

const OffrePedagogiqueManager = () => {

    const [offres, setOffres] = useState<EcorcesOffrePedagogique[]>([]);
        
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commitChanges = useCallback(async () => {
        try {
            setIsSaving(true);
            const updated = await saveOffrePedagogique(offres);
            setOffres(updated);
            setIsSaving(false);
        }
        catch (err: any) {
            setError(err.toString());
        }
    }, [offres]);


    useEffectAsync(async () => {
        try {
            setIsLoading(true);
            const allOffrePedagogiques = await getOffrePedagogique();
            setOffres(allOffrePedagogiques);
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

    const props: OffresPedagogiquesEditionProps = {
        offres,
        setOffres,
        commitChanges
    }

    return <OffresPedagogiquesEdition {...props} />;
}

type OffresPedagogiquesEditionProps = {
    offres: EcorcesOffrePedagogique[];
    setOffres: Dispatch<EcorcesOffrePedagogique[]>;
    commitChanges: () => Promise<void>;
}

const OffresPedagogiquesEdition = (props: OffresPedagogiquesEditionProps) => {

    const {
        offres,
        setOffres,
        commitChanges
    } = props;

    const [form, setForm] = useState<EcorcesOffrePedagogique>(createEmptyOffrePedagogique());
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [modified, setModified] = useState(false);

    const handleChange = (key: keyof EcorcesOffrePedagogique, value: any) => {
        setModified(true);
        setForm((prev) => {
            const base: EcorcesOffrePedagogique = prev ?? createEmptyOffrePedagogique();
            const result = { ...base, [key]: value };

            return result;
        });
    };

    const handleSave = () => {
        if (editingIndex !== null) {
            const updatedOffres = [...offres];
            updatedOffres[editingIndex] = form;
            setOffres(updatedOffres);
        } else {
            setOffres([...offres, form]);
        }
        setForm(createEmptyOffrePedagogique());
        setEditingIndex(null);
    };

    const handleEdit = (index: number) => {
        setForm(offres[index]);
        setEditingIndex(index);
    };

    const handleDelete = (index: number) => {
        setModified(true);
        const updatedOffres = offres.filter((_, i) => i !== index);
        setOffres(updatedOffres);
    };

    const handleDuplicate = (index: number) => {

        const newOffre = duplicateOffrePedagogique(offres[index]);
        setOffres([...offres, newOffre]);
        setForm(newOffre);
        setEditingIndex(offres.length);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm(createEmptyOffrePedagogique());
    }

    return <div className="w-full">
        <div className="flex flex-row justify-between items-center mb-6">
            <div className="heading-1">Offre pédagogique</div>
            <EcorcesButton
                onClick={commitChanges}
                disabled={!modified}
            >
                Sauvegarder
            </EcorcesButton>
        </div>

        <div className="mb-6">
            {offres.length === 0 ? (
                <p className="">Aucun offre pour l&apos;instant.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {offres.map((offre, index) => <OffreCard
                        key={`Offre-${index.toString().padStart(2, "0")}`}
                        offre={offre}
                        handleEdit={() => handleEdit(index)}
                        handleDelete={() => handleDelete(index)}
                        handleDuplicate={() => handleDuplicate(index)}
                    />)}
                </div>
            )}
        </div>

        <div className="p-4 border rounded flex flex-col items-stretch">
            <h2 className="text-xl font-bold mb-4">
                {editingIndex !== null ? "Modifier une offre" : "Ajouter une offre"}
            </h2>
            <div className="space-y-4">
                <div>
                    <EcorcesLabel>Titre</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Nom de l'offre"
                        value={form.name}
                        setValue={val => handleChange("name", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Visible</EcorcesLabel>
                    <EcorcesCheckbox
                        checked={form.visible}
                        onChange={v => handleChange("visible", v)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Description</EcorcesLabel>
                    <EcorcesTextArea
                        placeHolder="Quelques mots sur l'offre"
                        value={form.description}
                        setValue={val => handleChange("description", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Complet</EcorcesLabel>
                    <EcorcesCheckbox
                        checked={form.full}
                        onChange={f => handleChange("full", f)}
                    />
                </div>
                <div>
                    <EcorcesLabel>{"Lien (Optionnel)"}</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="www.google.com"
                        value={form.link ?? ""}
                        setValue={val => handleChange("link", val)}
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

type OffreCardProps = {
    offre: EcorcesOffrePedagogique;
    handleEdit: () => void;
    handleDelete: () => void;
    handleDuplicate: () => void;
}

const OffreCard = (props: OffreCardProps) => {

    const {
        offre,
        handleEdit,
        handleDelete,
        handleDuplicate
    } = props;

    return <div 
        className="p-4 border rounded shadow-sm flex flex-col justify-between"
    >
        <div className={mergeClasses(
            "flex flex-col text-gray-300",
            "relative",
            "p-3",
            "flex-grow"
        )}>

            <div className="font-bold text-xl text-golden">{offre.name}{offre.full && " (Complet)"}</div>
            <div className="">{offre.description}</div>
            <div className="text-sm">{offre.visible ? "Visible" : "Masqué"}</div>
            {offre.link && <TextLink href={offre.link} className="mt-2" target="_blank">
                Visiter le lien
            </TextLink>}
        </div>


        <div className="flex flex-row mt-4 space-x-2">
            <EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
            <EcorcesButton onClick={handleDelete}>Supprimer</EcorcesButton>
            <EcorcesButton onClick={handleDuplicate}>Dupliquer</EcorcesButton>
        </div>
    </div>
}

export default OffrePedagogiqueManager;