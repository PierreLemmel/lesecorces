"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useEffectAsync } from "../../../lib/hooks";
import {
	getAmi,
	listAmis,
	saveAmi,
	deleteAmi,
	duplicateAmi,
	EcorcesAmi,
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


const AmisManager = () => {
    const searchParams = useSearchParams();
    const isSuperAdmin = searchParams.get("superadmin")?.toLowerCase() === "true";

	const [amiIds, setAmiIds] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentAmi, setCurrentAmi] = useState<EcorcesAmi | null>(
		null
	);
	const [form, setForm] = useState<AmiForm>(createEmptyForm());

    const canCommitChanges = useMemo(() => {
        return form.profilePicture !== undefined && form.name !== "";
    }, [form]);
	const commitChanges = useCallback(
		async () => {
            if (!canCommitChanges) {
                throw new Error("Cannot commit changes");
            }

			try {
				setIsSaving(true);

				let amiToSave: EcorcesAmi;

                let {
                    profilePicture,
                    ...restForm
                } = form;



                if (profilePicture === undefined) {
                    throw new Error("Profile picture is required");
                }

				if (currentAmi) {
					amiToSave = {
                        ...currentAmi,
                        profilePicture,
                        ...restForm
                    };
				} else {
					amiToSave = {
                        profilePicture,
                        ...restForm
                    };
				}

				await saveAmi(amiToSave);

				setCurrentAmi(null);
				setForm(createEmptyForm());
				setAmiIds((prevIds) =>
					currentAmi ? prevIds : [...prevIds, form.name]
				);

				setIsSaving(false);
			} catch (err: any) {
				setError(err.toString());
			}
		},
		[canCommitChanges, currentAmi, form]
	);

	const onLoadAmi = useCallback(async (amiId: string) => {
		try {
			setIsLoading(true);

			const ami = await getAmi(amiId);
			setCurrentAmi(ami);
			setForm(createFormFromAmi(ami));

			setIsLoading(false);
		} catch (err: any) {
			setError(err.toString());
		}
	}, []);

	const onDeleteAmi = useCallback(
		async (amiId: string) => {
			try {
				setIsSaving(true);
				await deleteAmi(amiId);
				setAmiIds(amiIds.filter((id) => id !== amiId));
				setCurrentAmi(null);
				setForm(createEmptyForm());
				setIsSaving(false);
			} catch (err: any) {
				setError(err.toString());
			}
		},
		[amiIds]
	);

	const onDuplicateAmi = useCallback(async (amiId: string) => {
		try {
			setIsLoading(true);

			const ami = await getAmi(amiId);
			const newAmi = duplicateAmi(ami);

			setCurrentAmi(null);

			setForm(createFormFromAmi(newAmi));

			setIsLoading(false);
		} catch (err: any) {
			setError(err.toString());
		}
	}, []);

	const setFormValue = useCallback(
		(key: keyof AmiForm, value: any) => {
			setForm({
				...form,
				[key]: value,
			});
		},
		[form]
	);

	const onCancelChanges = useCallback(() => {
		setForm(createEmptyForm());
		setCurrentAmi(null);
	}, []);

	useEffectAsync(async () => {
		try {
			setIsLoading(true);
			const allIds = await listAmis();
			setAmiIds(allIds);
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

	const props: AmisEditionProps = {
		amiIds,
		form,
		setFormValue,
		isNewAmi: currentAmi === null,
		onLoadAmi,
		onDeleteAmi,
		onDuplicateAmi,
		onCancelChanges,
        canCommitChanges,
		commitChanges,
        isSuperAdmin
	};

	return <AmisEdition {...props} />;
};

type AmiForm = Omit<EcorcesAmi, "profilePicture"> & {
	profilePicture: EcorcesImage | undefined;
};

function createEmptyForm(): AmiForm {
	return {
		name: "Nouvel-le ami-e",
		role: "",
		socials: {},
		profilePicture: undefined,
        projects: "",
	};
}

function createFormFromAmi(ami: EcorcesAmi): AmiForm {
	return structuredClone(ami);
}

type AmisEditionProps = {
	amiIds: string[];
	form: AmiForm;
	setFormValue: (key: keyof AmiForm, value: any) => void;
	isNewAmi: boolean;
	onLoadAmi: (amiId: string) => Promise<void>;
	onDeleteAmi: (amiId: string) => Promise<void>;
	onDuplicateAmi: (amiId: string) => Promise<void>;
	onCancelChanges: () => void;

    canCommitChanges: boolean;
	commitChanges: () => Promise<void>;

    isSuperAdmin: boolean;
};

const AmisEdition = (props: AmisEditionProps) => {
	const {
		amiIds,
		onLoadAmi,
		form,
		setFormValue,
		isNewAmi,
        canCommitChanges,
		commitChanges,
		onDeleteAmi,
		onDuplicateAmi,
		onCancelChanges,
        isSuperAdmin
	} = props;

	const [modified, setModified] = useState(false);

	const handleChange = (key: keyof AmiForm, value: any) => {
		setModified(true);
		setFormValue(key, value);
	};

	const handleSave = commitChanges;

	const handleEdit = async (amiId: string) => await onLoadAmi(amiId);

	const handleDelete = async (amiId: string) =>
		await onDeleteAmi(amiId);

	const handleDuplicate = async (amiId: string) =>
		await onDuplicateAmi(amiId);

	const handleCancel = onCancelChanges;

	return (
		<div className="w-full">
			<div className="flex flex-row justify-between items-center mb-6">
				<div className="heading-1">Amis</div>
			</div>

			<div className="mb-6">
				{amiIds.length === 0 ? (
					<p className="">Aucun ami pour l&apos;instant. C&apos;est triste 😢</p>
				) : (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{amiIds.map((amiId, index) => (
							<AmiCard
								key={`Ami-${index.toString().padStart(2, "0")}`}
								amiId={amiId}
								handleEdit={() => handleEdit(amiId)}
								handleDelete={() => handleDelete(amiId)}
								handleDuplicate={() => handleDuplicate(amiId)}
                                isSuperAdmin={isSuperAdmin}
							/>
						))}
					</div>
				)}
			</div>

			{!(isNewAmi && !isSuperAdmin) && <div className="p-4 border rounded flex flex-col items-stretch">
				<h2 className="text-xl font-bold mb-4">
					{isNewAmi ? "Ajouter un ami" : "Modifier un ami"}
				</h2>
				<div className="space-y-4">
					<div>
						<EcorcesLabel>
							Nom{!isNewAmi && " (Non modifiable)"}
						</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Nom du ami"
							value={form.name}
							setValue={(val) => handleChange("name", val)}
							disabled={!isNewAmi}
						/>
					</div>
					<div>
						<EcorcesLabel>Role</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Rôle de l'ami-e"
							value={form.role}
							setValue={(val) => handleChange("role", val)}
						/>
					</div>
                    <div>
						<EcorcesLabel>Projets</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Projets sur lesquels l'ami-e a travaillé"
							value={form.projects}
							setValue={(val) => handleChange("projects", val)}
						/>
					</div>
					<div>
						<EcorcesLabel>Instagram</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Instagram"
							value={form.socials.instagram || ""}
							setValue={(val) =>
								handleChange("socials", { ...form.socials, instagram: val })
							}
						/>
					</div>
					<div>
						<EcorcesLabel>Facebook</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Facebook"
							value={form.socials.facebook || ""}
							setValue={(val) =>
								handleChange("socials", { ...form.socials, facebook: val })
							}
						/>
					</div>
					<div>
						<EcorcesLabel>Website</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Website"
							value={form.socials.website || ""}
							setValue={(val) =>
								handleChange("socials", { ...form.socials, website: val })
							}
						/>
					</div>
					<div>
						<EcorcesLabel>Soundcloud</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Soundcloud"
							value={form.socials.soundcloud || ""}
							setValue={(val) =>
								handleChange("socials", { ...form.socials, soundcloud: val })
							}
						/>
					</div>
					<div>
						<EcorcesLabel>Profile Picture</EcorcesLabel>
						<EcorcesImageUploader
							onUpload={(file) => handleChange("profilePicture", file)}
							file={form.profilePicture}
							destinationFolder="amis"
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

type AmiCardProps = {
	amiId: string;
	handleEdit: () => void;
	handleDelete: () => void;
	handleDuplicate: () => void;
    isSuperAdmin: boolean;
};

const AmiCard = (props: AmiCardProps) => {
	const { 
        amiId,
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
				<div className="font-bold text-xl text-golden">{amiId}</div>
			</div>

			<div className="flex flex-row mt-4 space-x-2">
				<EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
				<EcorcesButton onClick={handleDelete} disabled={!isSuperAdmin}>Supprimer</EcorcesButton>
				<EcorcesButton onClick={handleDuplicate} disabled={!isSuperAdmin}>Dupliquer</EcorcesButton>
			</div>
		</div>
	);
};

const ExportedAmisManager = () => <EcorcesSuspense>
	<AmisManager />
</EcorcesSuspense>;

export default ExportedAmisManager;