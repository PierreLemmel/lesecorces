"use client";

import { useCallback, useMemo, useState } from "react";
import { useEffectAsync } from "../../../lib/hooks";
import {
	getPartenaire,
	listPartenaires,
	savePartenaire,
	deletePartenaire,
	duplicatePartenaire,
	EcorcesPartenaire,
} from "../../../server/membres";
import { EcorcesImage } from "../../../server/server";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import EcorcesButton from "../../../components/ui/ecorces-button";
import { EcorcesLabel } from "../../../components/ui/ecorces-label";
import EcorcesTextInput from "../../../components/ui/ecorces-text-input";
import { mergeClasses } from "../../../lib/utils";
import EcorcesImageUploader from "../../../components/ui/ecorces-image-uploader";
import { useSearchParams } from "next/navigation";
import EcorcesSuspense from "../../../components/ui/ecorces-suspense";


const PartenairesManager = () => {
    const searchParams = useSearchParams();
    const isSuperAdmin = searchParams.get("superadmin")?.toLowerCase() === "true";

	const [partenaireIds, setPartenaireIds] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPartenaire, setCurrentPartenaire] = useState<EcorcesPartenaire | null>(
		null
	);
	const [form, setForm] = useState<PartenaireForm>(createEmptyForm());

    const canCommitChanges = useMemo(() => {
        return form.image !== undefined
            && form.name !== ""
            && form.url !== "";
    }, [form]);
	const commitChanges = useCallback(
		async () => {
            if (!canCommitChanges) {
                throw new Error("Cannot commit changes");
            }

			try {
				setIsSaving(true);

				let partenaireToSave: EcorcesPartenaire;

                let {
                    image,
                    ...restForm
                } = form;



                if (image === undefined) {
                    throw new Error("Profile picture is required");
                }

                if (form.name === "") {
                    throw new Error("Name is required");
                }

                if (form.url === "") {
                    throw new Error("URL is required");
                }


				if (currentPartenaire) {
					partenaireToSave = {
                        ...currentPartenaire,
                        image,
                        ...restForm
                    };
				} else {
					partenaireToSave = {
                        image,
                        ...restForm
                    };
				}

				await savePartenaire(partenaireToSave);

				setCurrentPartenaire(null);
				setForm(createEmptyForm());
				setPartenaireIds((prevIds) =>
					currentPartenaire ? prevIds : [...prevIds, form.name]
				);

				setIsSaving(false);
			} catch (err: any) {
				setError(err.toString());
			}
		},
		[canCommitChanges, currentPartenaire, form]
	);

	const onLoadPartenaire = useCallback(async (partenaireId: string) => {
		try {
			setIsLoading(true);

			const partenaire = await getPartenaire(partenaireId);
			setCurrentPartenaire(partenaire);
			setForm(createFormFromPartenaire(partenaire));

			setIsLoading(false);
		} catch (err: any) {
			setError(err.toString());
		}
	}, []);

	const onDeletePartenaire = useCallback(
		async (partenaireId: string) => {
			try {
				setIsSaving(true);
				await deletePartenaire(partenaireId);
				setPartenaireIds(partenaireIds.filter((id) => id !== partenaireId));
				setCurrentPartenaire(null);
				setForm(createEmptyForm());
				setIsSaving(false);
			} catch (err: any) {
				setError(err.toString());
			}
		},
		[partenaireIds]
	);

	const onDuplicatePartenaire = useCallback(async (partenaireId: string) => {
		try {
			setIsLoading(true);

			const partenaire = await getPartenaire(partenaireId);
			const newPartenaire = duplicatePartenaire(partenaire);

			setCurrentPartenaire(null);

			setForm(createFormFromPartenaire(newPartenaire));

			setIsLoading(false);
		} catch (err: any) {
			setError(err.toString());
		}
	}, []);

	const setFormValue = useCallback(
		(key: keyof PartenaireForm, value: any) => {
			setForm({
				...form,
				[key]: value,
			});
		},
		[form]
	);

	const onCancelChanges = useCallback(() => {
		setForm(createEmptyForm());
		setCurrentPartenaire(null);
	}, []);

	useEffectAsync(async () => {
		try {
			setIsLoading(true);
			const allIds = await listPartenaires();
			setPartenaireIds(allIds);
			setIsLoading(false);
		} catch (err: any) {
			setError(err.toString());
		}
	}, []);

	if (error) {
		return (
			<div>
				<div>Erreur : {error}</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div>
				<div>Chargement...</div>
				<LoadingSpinner />
			</div>
		);
	}

	if (isSaving) {
		return (
			<div>
				<div>Sauvegarde...</div>
				<LoadingSpinner />
			</div>
		);
	}

	const props: PartenairesEditionProps = {
		partenaireIds,
		form,
		setFormValue,
		isNewPartenaire: currentPartenaire === null,
		onLoadPartenaire,
		onDeletePartenaire,
		onDuplicatePartenaire,
		onCancelChanges,
        canCommitChanges,
		commitChanges,
        isSuperAdmin
	};

	return <PartenairesEdition {...props} />;
};

type PartenaireForm = Omit<EcorcesPartenaire, "image"> & {
	image: EcorcesImage | undefined;
};

function createEmptyForm(): PartenaireForm {
	return {
		name: "Nouvel-le partenaire-e",
		role: "",
		image: undefined,
        url: "",
        projects: "",
	};
}

function createFormFromPartenaire(partenaire: EcorcesPartenaire): PartenaireForm {
	return structuredClone(partenaire);
}

type PartenairesEditionProps = {
	partenaireIds: string[];
	form: PartenaireForm;
	setFormValue: (key: keyof PartenaireForm, value: any) => void;
	isNewPartenaire: boolean;
	onLoadPartenaire: (partenaireId: string) => Promise<void>;
	onDeletePartenaire: (partenaireId: string) => Promise<void>;
	onDuplicatePartenaire: (partenaireId: string) => Promise<void>;
	onCancelChanges: () => void;

    canCommitChanges: boolean;
	commitChanges: () => Promise<void>;

    isSuperAdmin: boolean;
};

const PartenairesEdition = (props: PartenairesEditionProps) => {
	const {
		partenaireIds,
		onLoadPartenaire,
		form,
		setFormValue,
		isNewPartenaire,
        canCommitChanges,
		commitChanges,
		onDeletePartenaire,
		onDuplicatePartenaire,
		onCancelChanges,
        isSuperAdmin
	} = props;

	const [modified, setModified] = useState(false);

	const handleChange = (key: keyof PartenaireForm, value: any) => {
		setModified(true);
		setFormValue(key, value);
	};

	const handleSave = commitChanges;

	const handleEdit = async (partenaireId: string) => await onLoadPartenaire(partenaireId);

	const handleDelete = async (partenaireId: string) =>
		await onDeletePartenaire(partenaireId);

	const handleDuplicate = async (partenaireId: string) =>
		await onDuplicatePartenaire(partenaireId);

	const handleCancel = onCancelChanges;

	return (
		<div className="w-full">
			<div className="flex flex-row justify-between items-center mb-6">
				<div className="heading-1">Partenaires</div>
			</div>

			<div className="mb-6">
				{partenaireIds.length === 0 ? (
					<p className="">Aucun partenaire pour l&apos;instant. C&apos;est triste 😢</p>
				) : (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{partenaireIds.map((partenaireId, index) => (
							<PartenaireCard
								key={`Partenaire-${index.toString().padStart(2, "0")}`}
								partenaireId={partenaireId}
								handleEdit={() => handleEdit(partenaireId)}
								handleDelete={() => handleDelete(partenaireId)}
								handleDuplicate={() => handleDuplicate(partenaireId)}
                                isSuperAdmin={isSuperAdmin}
							/>
						))}
					</div>
				)}
			</div>

			{!(isNewPartenaire && !isSuperAdmin) && <div className="p-4 border rounded flex flex-col items-stretch">
				<h2 className="text-xl font-bold mb-4">
					{isNewPartenaire ? "Ajouter un partenaire" : "Modifier un partenaire"}
				</h2>
				<div className="space-y-4">
					<div>
						<EcorcesLabel>
							Nom{!isNewPartenaire && " (Non modifiable)"}
						</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Nom du partenaire"
							value={form.name}
							setValue={(val) => handleChange("name", val)}
							disabled={!isNewPartenaire}
						/>
					</div>
					<div>
						<EcorcesLabel>Role</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Rôle du partenaire"
							value={form.role}
							setValue={(val) => handleChange("role", val)}
						/>
					</div>
                    <div>
						<EcorcesLabel>Projets</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Projets mené avec le ou la partenaire"
							value={form.projects}
							setValue={(val) => handleChange("projects", val)}
						/>
					</div>
					<div>
						<EcorcesLabel>Url</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Url"
							value={form.url}
							setValue={(val) =>
								handleChange("url", val)
							}
						/>
					</div>

					<div>
						<EcorcesLabel>Image</EcorcesLabel>
						<EcorcesImageUploader
							hasCropping={false}
							onUpload={(file) => handleChange("image", file)}
							file={form.image}
							destinationFolder="partenaires"
						/>
					</div>
				</div>
				<div className="mt-4 flex space-x-2">
					<EcorcesButton onClick={handleSave} disabled={!modified && canCommitChanges}>
						Sauvegarder
					</EcorcesButton>
					<EcorcesButton onClick={handleCancel}>Annuler</EcorcesButton>
				</div>
			</div>}
		</div>
	);
};

type PartenaireCardProps = {
	partenaireId: string;
	handleEdit: () => void;
	handleDelete: () => void;
	handleDuplicate: () => void;
    isSuperAdmin: boolean;
};

const PartenaireCard = (props: PartenaireCardProps) => {
	const { 
        partenaireId,
        handleEdit,
        handleDelete,
        handleDuplicate,
        isSuperAdmin
    } = props;

	return (
		<div className="p-4 border rounded shadow-sm flex flex-col justify-between">
			<div
				className={mergeClasses(
					"flex flex-col text-gray-300",
					"relative",
					"p-3",
					"flex-grow"
				)}
			>
				<div className="font-bold text-xl text-golden">{partenaireId}</div>
			</div>

			<div className="flex flex-row mt-4 space-x-2">
				<EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
				<EcorcesButton onClick={handleDelete} disabled={!isSuperAdmin}>Supprimer</EcorcesButton>
				<EcorcesButton onClick={handleDuplicate} disabled={!isSuperAdmin}>Dupliquer</EcorcesButton>
			</div>
		</div>
	);
};

export default () => <EcorcesSuspense>
	<PartenairesManager />
</EcorcesSuspense>;
