"use client";

import { Dispatch, useCallback, useState } from "react";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useEffectAsync } from "../../../lib/hooks";
import EcorcesButton from "../../../components/ui/ecorces-button";
import EcorcesTextInput from "../../../components/ui/ecorces-text-input";
import { EcorcesLabel } from "../../../components/ui/ecorces-label";
import { mergeClasses } from "../../../lib/utils";
import { EcorcesService, saveServices, getServices, duplicateService } from "../../../server/services";
import EcorcesCheckbox from "../../../components/ui/ecorces-checkbox";
import { loremIpsumMedium } from "../../../components/ui/ecorces-ui";
import EcorcesTextArea from "../../../components/ui/ecorces-text-area";


const SERVICES_COLLECTION = "espace-pro";

const EcorcesServiceManager = () => {
    const [services, setServices] = useState<EcorcesService[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commitChanges = useCallback(async () => {
        try {
            setIsSaving(true);
            const updated = await saveServices(services, SERVICES_COLLECTION);
            setServices(updated);
            setIsSaving(false);
        }
        catch (err: any) {
            setError(err.toString());
        }
    }, [services]);


    useEffectAsync(async () => {
        try {
            setIsLoading(true);
            const allServices = await getServices(SERVICES_COLLECTION);
            setServices(allServices);
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

    const props: ServicesEditionProps = {
        services,
        setServices,
        commitChanges
    }

    return <ServicesEdition {...props} />;
};


type ServiceForm = EcorcesService;

const createEmptyForm = (): ServiceForm => ({
    name: "Nouveau service",
    content: loremIpsumMedium,
    visible: true
});

type ServicesEditionProps = {
    services: EcorcesService[];
    setServices: Dispatch<EcorcesService[]>;
    commitChanges: () => Promise<void>;
}

const ServicesEdition = (props: ServicesEditionProps) => {

    const {
        services,
        setServices,
        commitChanges,
    } = props;

    const [form, setForm] = useState<ServiceForm>(createEmptyForm());
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [modified, setModified] = useState(false);


    const handleChange = (key: keyof EcorcesService, value: any) => {
        setModified(true);
        setForm((prev) => {
            const base: ServiceForm = prev ?? createEmptyForm();
            const result = { ...base, [key]: value };

            return result;
        });
    };

    const handleSave = () => {

        const newService: EcorcesService = structuredClone(form);

        if (editingIndex !== null) {
            const updatedServices = [...services];
            updatedServices[editingIndex] = newService;
            setServices(updatedServices);
        } else {
            setServices([...services, newService]);
        }
        setForm(createEmptyForm());
        setEditingIndex(null);
    };

    const handleEdit = (index: number) => {
        setForm(services[index]);
        setEditingIndex(index);
    };

    const handleDelete = (index: number) => {
        setModified(true);
        const updatedServices = services.filter((_, i) => i !== index);
        setServices(updatedServices);
    };

    const handleDuplicate = (index: number) => {

        const newService = duplicateService(services[index]);
        setServices([...services, newService]);
        setForm(newService);
        setEditingIndex(services.length);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm(createEmptyForm());
    }

    return <div className="w-full">
        <div className="flex flex-row justify-between items-center mb-6">
            <div className="heading-1">Services</div>
            <EcorcesButton
                onClick={commitChanges}
                disabled={!modified}
            >
                Sauvegarder
            </EcorcesButton>
        </div>

        <div className="mb-6">
            {services.length === 0 ? (
                <p className="">Aucun service pour l&apos;instant, c&apos;est triste 😢</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {services.map((partner, index) => <ServiceCard
                        key={`Service-${index.toString().padStart(2, "0")}`}
                        service={partner}
                        handleEdit={() => handleEdit(index)}
                        handleDelete={() => handleDelete(index)}
                        handleDuplicate={() => handleDuplicate(index)}
                    />)}
                </div>
            )}
        </div>

        <div className="p-4 border rounded flex flex-col items-stretch">
            <h2 className="text-xl font-bold mb-4">
                {editingIndex !== null ? "Modifier un service" : "Ajouter un service"}
            </h2>
            <div className="space-y-4">
                <div>
                    <EcorcesLabel>Nom</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Nom du service"
                        value={form.name}
                        setValue={val => handleChange("name", val)}
                    />
                </div>
                <div>
                    <EcorcesLabel>Content</EcorcesLabel>
                    <EcorcesTextArea
                        rows={6}
                        placeHolder="Contenu du service"
                        value={form.content}
                        setValue={val => handleChange("content", val)}
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


type ServiceCardProps = {
    service: EcorcesService;
    handleEdit: () => void;
    handleDelete: () => void;
    handleDuplicate: () => void;
}

const ServiceCard = (props: ServiceCardProps) => {

    const {
        service: {
            name,
            content,
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
                <div className="font-bold text-xl text-golden">{name} {visible ? "": "(Inactif)"}</div>
                <div className="">{content}</div>
            </div>

            <div className="flex flex-row mt-4 space-x-2">
                <EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
                <EcorcesButton onClick={handleDelete}>Supprimer</EcorcesButton>
                <EcorcesButton onClick={handleDuplicate}>Dupliquer</EcorcesButton>
            </div>
        </div>
    );
}

export default EcorcesServiceManager;