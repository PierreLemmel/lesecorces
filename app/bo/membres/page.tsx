"use client";

import { useCallback, useMemo, useState } from "react";
import { useEffectAsync } from "../../../lib/hooks";
import {
	getMembre,
	listMembres,
	saveMembre,
	deleteMembre,
	duplicateMembre,
	EcorcesMembre,
} from "../../../server/membres";
import { EcorcesImage } from "../../../server/server";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import EcorcesButton from "../../../components/ui/ecorces-button";
import { EcorcesLabel } from "../../../components/ui/ecorces-label";
import EcorcesTextInput from "../../../components/ui/ecorces-text-input";
import { mergeClasses } from "../../../lib/utils";
import EcorcesImageUploader from "../../../components/ui/ecorces-image-uploader";
import EcorcesTextArea from "../../../components/ui/ecorces-text-area";
import { layoutClasses, loremIpsumMedium } from "../../../components/ui/ecorces-ui";
import { useSearchParams } from "next/navigation";
import EcorcesSuspense from "../../../components/ui/ecorces-suspense";


const MembresManager = () => {
    const searchParams = useSearchParams();
    const isSuperAdmin = searchParams.get("superadmin")?.toLowerCase() === "true";

	const [membreIds, setMembreIds] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentMembre, setCurrentMembre] = useState<EcorcesMembre | null>(
		null
	);
	const [form, setForm] = useState<MembreForm>(createEmptyForm());

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

				let membreToSave: EcorcesMembre;

                let {
                    gallery,
                    profilePicture,
                    ...restForm
                } = form;


                const safeGallery = gallery.filter(val => val !== undefined) as EcorcesImage[];

                if (profilePicture === undefined) {
                    throw new Error("Profile picture is required");
                }

				if (currentMembre) {
					membreToSave = {
                        ...currentMembre,
                        gallery: safeGallery,
                        profilePicture,
                        ...restForm
                    };
				} else {
					membreToSave = {
                        gallery: safeGallery,
                        profilePicture,
                        ...restForm
                    };
				}

				await saveMembre(membreToSave);

				setCurrentMembre(null);
				setForm(createEmptyForm());
				setMembreIds((prevIds) =>
					currentMembre ? prevIds : [...prevIds, form.name]
				);

				setIsSaving(false);
			} catch (err: any) {
				setError(err.toString());
			}
		},
		[canCommitChanges, currentMembre, form]
	);

	const onLoadMembre = useCallback(async (membreId: string) => {
		try {
			setIsLoading(true);

			const membre = await getMembre(membreId);
			setCurrentMembre(membre);
			setForm(createFormFromMembre(membre));

			setIsLoading(false);
		} catch (err: any) {
			setError(err.toString());
		}
	}, []);

	const onDeleteMembre = useCallback(
		async (membreId: string) => {
			try {
				setIsSaving(true);
				await deleteMembre(membreId);
				setMembreIds(membreIds.filter((id) => id !== membreId));
				setCurrentMembre(null);
				setForm(createEmptyForm());
				setIsSaving(false);
			} catch (err: any) {
				setError(err.toString());
			}
		},
		[membreIds]
	);

	const onDuplicateMembre = useCallback(async (membreId: string) => {
		try {
			setIsLoading(true);

			const membre = await getMembre(membreId);
			const newMembre = duplicateMembre(membre);

			setCurrentMembre(null);

			setForm({
				...createFormFromMembre(newMembre),
				name: `${newMembre.name} (copie)`,
			});

			setIsLoading(false);
		} catch (err: any) {
			setError(err.toString());
		}
	}, []);

	const setFormValue = useCallback(
		(key: keyof MembreForm, value: any) => {
			setForm({
				...form,
				[key]: value,
			});
		},
		[form]
	);

	const onCancelChanges = useCallback(() => {
		setForm(createEmptyForm());
		setCurrentMembre(null);
	}, []);

	useEffectAsync(async () => {
		try {
			setIsLoading(true);
			const allIds = await listMembres();
			setMembreIds(allIds);
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

	const props: MembresEditionProps = {
		membreIds,
		form,
		setFormValue,
		isNewMembre: currentMembre === null,
		onLoadMembre,
		onDeleteMembre,
		onDuplicateMembre,
		onCancelChanges,
        canCommitChanges,
		commitChanges,
        isSuperAdmin
	};

	return <MembresEdition {...props} />;
};

type MembreForm = Omit<EcorcesMembre, "gallery" | "profilePicture"> & {
	profilePicture: EcorcesImage | undefined;
	gallery: (EcorcesImage | undefined)[];
};

function createEmptyForm(): MembreForm {
	return {
		name: "Nouveau membre",
		role: "",
		socials: {},
		profilePicture: undefined,
		gallery: [],
        description: {
            shortBio: loremIpsumMedium,
            paragraph1: loremIpsumMedium,
            paragraph2: loremIpsumMedium,
            paragraph3: loremIpsumMedium,
        }
	};
}

function createFormFromMembre(membre: EcorcesMembre): MembreForm {
	return structuredClone(membre);
}

type MembresEditionProps = {
	membreIds: string[];
	form: MembreForm;
	setFormValue: (key: keyof MembreForm, value: any) => void;
	isNewMembre: boolean;
	onLoadMembre: (membreId: string) => Promise<void>;
	onDeleteMembre: (membreId: string) => Promise<void>;
	onDuplicateMembre: (membreId: string) => Promise<void>;
	onCancelChanges: () => void;

    canCommitChanges: boolean;
	commitChanges: () => Promise<void>;

    isSuperAdmin: boolean;
};

const MembresEdition = (props: MembresEditionProps) => {
	const {
		membreIds,
		onLoadMembre,
		form,
		setFormValue,
		isNewMembre,
        canCommitChanges,
		commitChanges,
		onDeleteMembre,
		onDuplicateMembre,
		onCancelChanges,
        isSuperAdmin
	} = props;

	const [modified, setModified] = useState(false);

	const handleChange = (key: keyof MembreForm, value: any) => {
		setModified(true);
		setFormValue(key, value);
	};

	const handleSave = commitChanges;

	const handleEdit = async (membreId: string) => await onLoadMembre(membreId);

	const handleDelete = async (membreId: string) =>
		await onDeleteMembre(membreId);

	const handleDuplicate = async (membreId: string) =>
		await onDuplicateMembre(membreId);

	const handleCancel = onCancelChanges;

	return (
		<div className="w-full">
			<div className="flex flex-row justify-between items-center mb-6">
				<div className={mergeClasses(layoutClasses.heading1)}>Membres</div>
			</div>

			<div className="mb-6">
				{membreIds.length === 0 ? (
					<p className="">Aucun membre pour l&apos;instant.</p>
				) : (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{membreIds.map((membreId, index) => (
							<MembreCard
								key={`Membre-${index.toString().padStart(2, "0")}`}
								membreId={membreId}
								handleEdit={() => handleEdit(membreId)}
								handleDelete={() => handleDelete(membreId)}
								handleDuplicate={() => handleDuplicate(membreId)}
                                isSuperAdmin={isSuperAdmin}
							/>
						))}
					</div>
				)}
			</div>

			{!(isNewMembre && !isSuperAdmin) && <div className="p-4 border rounded flex flex-col items-stretch">
				<h2 className="text-xl font-bold mb-4">
					{isNewMembre ? "Ajouter un membre" : "Modifier un membre"}
				</h2>
				<div className="space-y-4">
					<div>
						<EcorcesLabel>
							Nom{!isNewMembre && " (Non modifiable)"}
						</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Nom du membre"
							value={form.name}
							setValue={(val) => handleChange("name", val)}
							disabled={!isNewMembre}
						/>
					</div>
					<div>
						<EcorcesLabel>Role</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Role du membre"
							value={form.role}
							setValue={(val) => handleChange("role", val)}
						/>
					</div>
                    <div>
                        <EcorcesLabel>Petite Bio</EcorcesLabel>
                        <EcorcesTextArea
                            value={form.description.shortBio}
                            setValue={(val) => handleChange("description", {
                                ...form.description,
                                shortBio: val
                            } satisfies EcorcesMembre["description"])}
                        />
                    </div>
                    <div>
                        <EcorcesLabel>Paragraphe 1</EcorcesLabel>
                        <EcorcesTextArea
                            value={form.description.paragraph1}
                            setValue={(val) => handleChange("description", {
                                ...form.description,
                                paragraph1: val
                            } satisfies EcorcesMembre["description"])}
                        />
                    </div>
                    <div>
                        <EcorcesLabel>Paragraphe 2</EcorcesLabel>
                        <EcorcesTextArea
                            value={form.description.paragraph2}
                            setValue={(val) => handleChange("description", {
                                ...form.description,
                                paragraph2: val
                            } satisfies EcorcesMembre["description"])}
                        />
                    </div>
                    <div>
                        <EcorcesLabel>Paragraphe 3</EcorcesLabel>
                        <EcorcesTextArea
                            value={form.description.paragraph3}
                            setValue={(val) => handleChange("description", {
                                ...form.description,
                                paragraph3: val
                            } satisfies EcorcesMembre["description"])}
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
						<EcorcesLabel>Photo de profil</EcorcesLabel>
						<EcorcesImageUploader
							onUpload={(file) => handleChange("profilePicture", file)}
							file={form.profilePicture}
							destinationFolder="membres"
						/>
					</div>
					<div>
						<EcorcesLabel>Gallery</EcorcesLabel>
						
						{form.gallery.map((image, index) => (
							<div key={index} className="mb-2">
								<EcorcesImageUploader
									onUpload={(file) => {
										const newGallery = [...form.gallery];
										newGallery[index] = file;
										handleChange("gallery", newGallery);
									}}
									file={image}
									destinationFolder="membres"
								/>
							</div>
						))}
						<EcorcesButton
							onClick={() =>
								handleChange("gallery", [...form.gallery, undefined])
							}
						>
							Add Image
						</EcorcesButton>
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

type MembreCardProps = {
	membreId: string;
	handleEdit: () => void;
	handleDelete: () => void;
	handleDuplicate: () => void;
    isSuperAdmin: boolean;
};

const MembreCard = (props: MembreCardProps) => {
	const { 
        membreId,
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
				<div className="font-bold text-xl text-golden">{membreId}</div>
			</div>

			<div className="flex flex-row mt-4 space-x-2">
				<EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
				<EcorcesButton onClick={handleDelete} disabled={!isSuperAdmin}>Supprimer</EcorcesButton>
				<EcorcesButton onClick={handleDuplicate} disabled={!isSuperAdmin}>Dupliquer</EcorcesButton>
			</div>
		</div>
	);
};

const ExportedMembresManager = () => <EcorcesSuspense>
	<MembresManager />
</EcorcesSuspense>;

export default ExportedMembresManager;