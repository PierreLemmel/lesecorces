"use client";

import { Dispatch, useCallback, useEffect, useState } from "react";
import { useEffectAsync } from "../../../lib/hooks";
import { addVersionToBlock, createBlock, createEmptyBlock, deleteBlock, duplicateBlock,  EcorcesBlock, getBlock, listBlocksIds, saveBlock } from "../../../server/server";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import EcorcesButton from "../../../components/ui/ecorces-button";
import { EcorcesLabel } from "../../../components/ui/ecorces-label";
import EcorcesTextInput from "../../../components/ui/ecorces-text-input";
import EcorcesTextArea from "../../../components/ui/ecorces-text-area";
import { mergeClasses } from "../../../lib/utils";

const BlocksManager = () => {

    const [blockIds, setBlockIds] = useState<string[]>([]);
        
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentBlock, setCurrentBlock] = useState<EcorcesBlock | null>(null);
    const [form, setForm] = useState<BlockForm>(createEmptyForm());

    const commitChanges = useCallback(async () => {
        
        try {

            let blockToSave;

            if (currentBlock) {
                blockToSave = addVersionToBlock(currentBlock, form.content);
            }
            else {
                blockToSave = createBlock(form.id, form.content);
                setBlockIds([...blockIds, form.id]);
            }

            setIsSaving(true);

            await saveBlock(blockToSave);

            setCurrentBlock(null);
            setForm(createEmptyForm());

            setIsSaving(false);
        }
        catch (err: any) {
            setError(err.toString());
        }
    }, [blockIds, currentBlock, form]);


    const onLoadBlock = useCallback(async (blockId: string) => {

        try {
            setIsLoading(true);

            const block = await getBlock(blockId);
            setCurrentBlock(block);
            setForm(createFormFromBlock(block));
    
            setIsLoading(false);
        }
        catch (err: any) {
            setError(err.toString());
        }
        
    }, []);


    const onDeleteBlock = useCallback(async (blockId: string) => {

        try {
            setIsSaving(true);
            await deleteBlock(blockId);
            setBlockIds(blockIds.filter(id => id !== blockId));
            setCurrentBlock(null);
            setForm(createEmptyForm());
            setIsSaving(false);
        }
        catch (err: any) {
            setError(err.toString());
        }

    }, [blockIds]);

    const onDuplicateBlock = useCallback(async (blockId: string) => {

        try {
            setIsLoading(true);

            const block = await getBlock(blockId);
            const newBlock = duplicateBlock(block);

            setCurrentBlock(null);
            setForm(createFormFromBlock(newBlock));

            setIsLoading(false);
        }
        catch (err: any) {
            setError(err.toString());
        }

    }, []);

    const setFormValue = useCallback((key: keyof BlockForm, value: any) => {
        setForm({
            ...form,
            [key]: value
        });
    }, [form]);

    const onCancelChanges = useCallback(() => {
        setForm(createEmptyForm());
        setCurrentBlock(null);
    }, []);

    useEffectAsync(async () => {

        try {
            setIsLoading(true);
            const allIds = await listBlocksIds();
            setBlockIds(allIds);
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

    const props: BlocksEditionProps = {
        blockIds,
        form,
        setFormValue,
        isNewBlock: currentBlock === null,
        onLoadBlock,
        onDeleteBlock,
        onDuplicateBlock,
        onCancelChanges,
        commitChanges
    }

    return <BlocksEdition {...props} />;
}


type BlockForm = {
    id: string;
    content: string;
}

function createEmptyForm(): BlockForm {
    return {
        id: "NEW_BLOCK",
        content: ""
    }
}

function createFormFromBlock(block: EcorcesBlock): BlockForm {

    const { id, content } = block;

    return {
        id,
        content
    }
}

type BlocksEditionProps = {
    blockIds: string[];
    form: BlockForm;
    setFormValue: (key: keyof BlockForm, value: any) => void;
    isNewBlock: boolean;
    onLoadBlock: (blockId: string) => Promise<void>;
    onDeleteBlock: (blockId: string) => Promise<void>;
    onDuplicateBlock: (blockId: string) => Promise<void>;
    onCancelChanges: () => void;
    commitChanges: () => Promise<void>;
}

const BlocksEdition = (props: BlocksEditionProps) => {

    const {
        blockIds,
        onLoadBlock,
        form,
        setFormValue,
        isNewBlock,
        commitChanges,
        onDeleteBlock,
        onDuplicateBlock,
        onCancelChanges
    } = props;

    const [modified, setModified] = useState(false);

    const handleChange = (key: keyof BlockForm, value: any) => {
        setModified(true);
        setFormValue(key, value);
    };

    const handleSave = commitChanges;

    const handleEdit = async (blockId: string) => await onLoadBlock(blockId);

    const handleDelete = async (blockId: string) => await onDeleteBlock(blockId);

    const handleDuplicate = async (blockId: string) => await onDuplicateBlock(blockId);

    const handleCancel = onCancelChanges;

    return <div className="w-full">
        <div className="flex flex-row justify-between items-center mb-6">
            <div className="heading-1">Blocs</div>
        </div>

        <div className="mb-6">
            {blockIds.length === 0 ? (
                <p className="">Aucun offre pour l&apos;instant.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {blockIds.map((blockId, index) => <OffreCard
                        key={`Block-${index.toString().padStart(2, "0")}`}
                        blockId={blockId}
                        handleEdit={() => handleEdit(blockId)}
                        handleDelete={() => handleDelete(blockId)}
                        handleDuplicate={() => handleDuplicate(blockId)}
                    />)}
                </div>
            )}
        </div>

        <div className="p-4 border rounded flex flex-col items-stretch">
            <h2 className="text-xl font-bold mb-4">
                {isNewBlock ? "Ajouter un bloc" : "Modifier un bloc"}
            </h2>
            <div className="space-y-4">
                <div>
                    <EcorcesLabel>Identifiant{!isNewBlock && " (Non modifiable)"}</EcorcesLabel>
                    <EcorcesTextInput
                        placeHolder="Nom de l'offre"
                        value={form.id}
                        setValue={val => handleChange("id", val)}
                        disabled={!isNewBlock}
                    />
                </div>
                <div>
                    <EcorcesLabel>Content</EcorcesLabel>
                    <EcorcesTextArea
                        placeHolder="Quelques mots sur l'offre"
                        value={form.content}
                        setValue={val => handleChange("content", val)}
                    />
                </div>
            </div>
            <div className="mt-4 flex space-x-2">
                <EcorcesButton
                    onClick={handleSave}
                    disabled={!modified}
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

type BlockCardProps = {
    blockId: string;
    handleEdit: () => void;
    handleDelete: () => void;
    handleDuplicate: () => void;
}

const OffreCard = (props: BlockCardProps) => {

    const {
        blockId,
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

            <div className="font-bold text-xl text-golden">{blockId}</div>
        </div>


        <div className="flex flex-row mt-4 space-x-2">
            <EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
            <EcorcesButton onClick={handleDelete}>Supprimer</EcorcesButton>
            <EcorcesButton onClick={handleDuplicate}>Dupliquer</EcorcesButton>
        </div>
    </div>
}

export default BlocksManager;