"use client";

import { Dispatch, useCallback, useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { ActiviteType, ActiviteVille, allActiviteVilles, allActivityTypes, createEmptyActivite, duplicateActivite, EcorcesActivite, getActivites, saveActivites } from "../../../server/server";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useEffectAsync } from "../../../lib/hooks";
import EcorcesButton from "../../../components/ui/ecorces-button";
import { TextLink } from "../../../components/ui/text-link";
import EcorcesTextInput from "../../../components/ui/ecorces-text-input";
import { EcorcesDatePicker } from "../../../components/ui/ecorces-date-picker";
import { EcorcesLabel } from "../../../components/ui/ecorces-label";
import EcorcesSelectMenu from "../../../components/ui/ecorces-select-menu";
import EcorcesCheckbox from "../../../components/ui/ecorces-checkbox";
import EcorcesImageUploader from "../../../components/ui/ecorces-image-uploader";
import { mergeClasses } from "../../../lib/utils";
import { backgroundUrl, croppedImageUrl, layoutClasses } from "../../../components/ui/ecorces-ui";
import EcorcesTextArea from "../../../components/ui/ecorces-text-area";
import { useSearchParams } from "next/navigation";
import EcorcesSuspense from "../../../components/ui/ecorces-suspense";


const EcorcesActivites = () => {
    const searchParams = useSearchParams();
    const isSuperAdmin = searchParams.get("superadmin")?.toLowerCase() === "true";

    const [activities, setActivities] = useState<EcorcesActivite[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commitChanges = useCallback(async () => {
        try {
            setIsSaving(true);
            const updated = await saveActivites(activities);
            setActivities(updated);
            setIsSaving(false);
        }
        catch (err: any) {
            setError(err.toString());
        }
    }, [activities]);


    useEffectAsync(async () => {
        try {
            setIsLoading(true);
            const allActivites = await getActivites();
            setActivities(allActivites);
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

    const props: ActivitesEditionProps = {
        activities,
        setActivities,
        commitChanges,
        isSuperAdmin
    }

    return <ActivitesEdition {...props} />;
};

type ActivitesEditionProps = {
    activities: EcorcesActivite[];
    setActivities: Dispatch<EcorcesActivite[]>;
    commitChanges: () => Promise<void>;
    isSuperAdmin: boolean;
}

const ActivitesEdition = (props: ActivitesEditionProps) => {

    const {
        activities,
        setActivities,
        commitChanges,
        isSuperAdmin
    } = props;

    const [form, setForm] = useState<EcorcesActivite>(createEmptyActivite());
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [modified, setModified] = useState(false);


    const handleChange = (key: keyof EcorcesActivite, value: any) => {
        setModified(true);
        setForm((prev) => {
            const base: EcorcesActivite = prev ?? createEmptyActivite();
            const result = { ...base, [key]: value };

            return result;
        });
    };

    const handleSave = () => {
        if (editingIndex !== null) {
            const updatedActivities = [...activities];
            updatedActivities[editingIndex] = form;
            setActivities(updatedActivities);
        } else {
            setActivities([...activities, form]);
        }
        setForm(createEmptyActivite());
        setEditingIndex(null);
    };

    const handleEdit = (index: number) => {
        setForm(activities[index]);
        setEditingIndex(index);
    };

    const handleDelete = (index: number) => {
        setModified(true);
        const updatedActivities = activities.filter((_, i) => i !== index);
        setActivities(updatedActivities);
    };

    const handleDuplicate = (index: number) => {

        const newActivity = duplicateActivite(activities[index]);
        setActivities([...activities, newActivity]);
        setForm(newActivity);
        setEditingIndex(activities.length);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm(createEmptyActivite());
    }

    const [citySelection, setCitySelection] = useState<ActiviteVille>("Lyon");
    const [otherCity, setOtherCity] = useState<string>("");

    useEffect(() => {

        const city = citySelection !== "Autre" ? citySelection : otherCity;
        handleChange("city", city);

    }, [citySelection, otherCity]);

    useEffect(() => {

        if (form.city === "Lyon" || form.city === "Paris") {
            setCitySelection(form.city);
            setOtherCity("");
        }
        else {
            setCitySelection("Autre");
            setOtherCity(form.city);
        }
    }, [form])

    return <div className="w-full">
        <div className="flex flex-row justify-between items-center mb-6">
            <div className={mergeClasses(layoutClasses.heading1)}>Activités</div>
            <EcorcesButton
                onClick={commitChanges}
                disabled={!modified}
            >
                Sauvegarder
            </EcorcesButton>
        </div>

        <div className="mb-6">
            {activities.length === 0 ? (
                <p className="">Aucun activité pour l&apos;instant.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {activities.map((activity, index) => <ActivityCard
                        key={`Activite-${index.toString().padStart(2, "0")}`}
                        activity={activity}
                        handleEdit={() => handleEdit(index)}
                        handleDelete={() => handleDelete(index)}
                        handleDuplicate={() => handleDuplicate(index)}
                        isSuperAdmin={isSuperAdmin}
                    />)}
                </div>
            )}
        </div>

        <div className="p-4 border rounded flex flex-col items-stretch">
            <h2 className="text-xl font-bold mb-4">
                {editingIndex !== null ? "Modifier une activité" : "Ajouter une activité"}
            </h2>
            <div className="space-y-4">
                <div>
                    <EcorcesLabel>Titre</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Titre de l'activité"
                        value={form.title}
                        setValue={val => handleChange("title", val)}
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
                    <EcorcesLabel>Type</EcorcesLabel>
                    <EcorcesSelectMenu<ActiviteType>
                        options={allActivityTypes.map(t => ({ value: t, label: t }))}
                        value={form.type}
                        onChange={t => handleChange("type", t)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Date de début</EcorcesLabel>
                    <EcorcesDatePicker
                        className="w-full"
                        date={form.date.toDate()}
                        setDate={d => handleChange("date", Timestamp.fromDate(d))}
                    />
                </div>
                <div>
                    <EcorcesLabel>{"Date de fin (Optionnelle)"}</EcorcesLabel>
                    <EcorcesDatePicker
                        className="w-full"
                        date={form.endDate?.toDate() ?? null}
                        setDate={d => handleChange("endDate", Timestamp.fromDate(d))}
                    />
                </div>
                <div>
                    <EcorcesLabel>Lieu</EcorcesLabel>
                    <EcorcesSelectMenu<ActiviteVille>
                        options={allActiviteVilles.map(v => ({ value: v, label: v }))}
                        value={citySelection}
                        onChange={setCitySelection}
                    />
                </div>
                {citySelection === "Autre" && <div>
                    <EcorcesLabel>Autre lieu</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Préciser le lieu"
                        value={otherCity}
                        setValue={setOtherCity}
                    />
                </div>}
                <div>
                    <EcorcesLabel>Description</EcorcesLabel>
                    <EcorcesTextArea
                        rows={4}
                        placeHolder="Quelques mots sur l'activité"
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
                    <EcorcesLabel>{"Image (Optionnelle)"}</EcorcesLabel>
                    <EcorcesImageUploader
                        onUpload={f => handleChange("banneer", f)}
                        file={form.banneer}
                        destinationFolder="activites"
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


type ActivityCardProps = {
    activity: EcorcesActivite;
    handleEdit: () => void;
    handleDelete: () => void;
    handleDuplicate: () => void;
    isSuperAdmin: boolean;
}

const ActivityCard = (props: ActivityCardProps) => {

    const {
        activity,
        handleEdit,
        handleDelete,
        handleDuplicate,
        isSuperAdmin
    } = props;

    const bgUrl = activity.banneer ? croppedImageUrl(activity.banneer.url, activity.banneer.cropArea) : null;

    return (
        <div 
            className="p-4 border rounded shadow-sm flex flex-col justify-between"
        >
            <div className={mergeClasses(
                "flex flex-col text-gray-300",
                "relative",
                "p-3",
                "flex-grow"
            )}

            >
                {bgUrl && <div className={mergeClasses(
                    "bg-cover bg-center bg-no-repeat",
                    "absolute top-0 left-0 right-0 bottom-0 -z-10",
                    "opacity-45 rounded"
                )} style={{
                    backgroundImage: backgroundUrl(bgUrl),
                }} />}

                <div className="font-bold text-xl text-golden">{activity.title}{activity.full && " (Complet)"}</div>
                <div className="text-sm italic mb-2">{activity.city} - {activity.type}</div>
                <div className="">{activity.description}</div>
                <div className="text-sm">
                    {activity.endDate ?
                        `Du ${activity.date.toDate().toLocaleDateString()} au ${activity.endDate.toDate().toLocaleDateString()}` :
                        `Le ${activity.date.toDate().toLocaleDateString()}`}
                </div>
                <div className="text-sm">{activity.visible ? "Visible" : "Masqué"}</div>
                {activity.link && <TextLink href={activity.link} className="mt-2" target="_blank">
                    Visiter le lien
                </TextLink>}
            </div>

            <div className="flex flex-row mt-4 space-x-2">
                <EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
                <EcorcesButton onClick={handleDelete} disabled={!isSuperAdmin}>Supprimer</EcorcesButton>
                <EcorcesButton onClick={handleDuplicate}>Dupliquer</EcorcesButton>
            </div>
        </div>
    );
}

const EcorcesActivitesManager = () => <EcorcesSuspense>
	<EcorcesActivites />
</EcorcesSuspense>;

export default EcorcesActivitesManager;