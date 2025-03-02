"use client";

import { useCallback, useMemo, useState } from "react";
import { useEffectAsync } from "../../../lib/hooks";
import {
	getSpectacle,
	listSpectacles,
	saveSpectacle,
	deleteSpectacle,
	duplicateSpectacle,
	EcorcesSpectacle,
} from "../../../server/spectacles";
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


const SpectaclesManager = () => {
    const searchParams = useSearchParams();
    const isSuperAdmin = searchParams.get("superadmin")?.toLowerCase() === "true";

	const [spectacleIds, setSpectacleIds] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentSpectacle, setCurrentSpectacle] = useState<EcorcesSpectacle | null>(
		null
	);
	const [form, setForm] = useState<SpectacleForm>(createEmptyForm());

    const canCommitChanges = useMemo(() => {
        return form.affiche !== undefined && form.name !== "";
    }, [form]);
	const commitChanges = useCallback(
		async () => {
            if (!canCommitChanges) {
                throw new Error("Cannot commit changes");
            }

			try {
				setIsSaving(true);

				let spectacleToSave: EcorcesSpectacle;

                let {
                    gallery,
                    affiche,
                    ...restForm
                } = form;


                const safeGallery = gallery.filter(val => val !== undefined) as EcorcesImage[];

                if (affiche === undefined) {
                    throw new Error("Affiche is required");
                }

				if (currentSpectacle) {
					spectacleToSave = {
                        ...currentSpectacle,
                        gallery: safeGallery,
                        affiche,
                        ...restForm
                    };
				} else {
					spectacleToSave = {
                        gallery: safeGallery,
                        affiche,
                        ...restForm
                    };
				}

				await saveSpectacle(spectacleToSave);

				setCurrentSpectacle(null);
				setForm(createEmptyForm());
				setSpectacleIds((prevIds) =>
					currentSpectacle ? prevIds : [...prevIds, form.name]
				);

				setIsSaving(false);
			} catch (err: any) {
				setError(err.toString());
			}
		},
		[canCommitChanges, currentSpectacle, form]
	);

	const onLoadSpectacle = useCallback(async (spectacleId: string) => {
		try {
			setIsLoading(true);

			const spectacle = await getSpectacle(spectacleId);
			setCurrentSpectacle(spectacle);
			setForm(createFormFromSpectacle(spectacle));

			setIsLoading(false);
		} catch (err: any) {
			setError(err.toString());
		}
	}, []);

	const onDeleteSpectacle = useCallback(
		async (spectacleId: string) => {
			try {
				setIsSaving(true);
				await deleteSpectacle(spectacleId);
				setSpectacleIds(spectacleIds.filter((id) => id !== spectacleId));
				setCurrentSpectacle(null);
				setForm(createEmptyForm());
				setIsSaving(false);
			} catch (err: any) {
				setError(err.toString());
			}
		},
		[spectacleIds]
	);

	const onDuplicateSpectacle = useCallback(async (spectacleId: string) => {
		try {
			setIsLoading(true);

			const spectacle = await getSpectacle(spectacleId);
			const newSpectacle = duplicateSpectacle(spectacle);

			setCurrentSpectacle(null);

			setForm({
				...createFormFromSpectacle(newSpectacle),
				name: `${newSpectacle.name} (copie)`,
			});

			setIsLoading(false);
		} catch (err: any) {
			setError(err.toString());
		}
	}, []);

	const setFormValue = useCallback(
		(key: keyof SpectacleForm, value: any) => {
			setForm({
				...form,
				[key]: value,
			});
		},
		[form]
	);

	const onCancelChanges = useCallback(() => {
		setForm(createEmptyForm());
		setCurrentSpectacle(null);
	}, []);

	useEffectAsync(async () => {
		try {
			setIsLoading(true);
			const allIds = await listSpectacles();
			setSpectacleIds(allIds);
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

	const props: SpectaclesEditionProps = {
		spectacleIds,
		form,
		setFormValue,
		isNewSpectacle: currentSpectacle === null,
		onLoadSpectacle,
		onDeleteSpectacle,
		onDuplicateSpectacle,
		onCancelChanges,
        canCommitChanges,
		commitChanges,
        isSuperAdmin
	};

	return <SpectaclesEdition {...props} />;
};

type SpectacleForm = Omit<EcorcesSpectacle, "gallery" | "affiche"> & {
	affiche: EcorcesImage | undefined;
	gallery: (EcorcesImage | undefined)[];
};

function createEmptyForm(): SpectacleForm {
	return {
        name: "Nouveau spectacle",
        ficheTechnique: {
            creation: "2018",
            duree: "1h00",
            artistes: "3",
			age: "10+",
            genres: "Théâtre Improvisé"
        },
        teaser: undefined,
        description: {
            paragraph1: loremIpsumMedium,
            paragraph2: loremIpsumMedium,
            paragraph3: loremIpsumMedium,
        },
        socials: {
            billetreduc: "https://www.billetreduc.com/368219/evt.htm"
        },
        affiche: undefined,
        gallery: []
    }
}

function createFormFromSpectacle(spectacle: EcorcesSpectacle): SpectacleForm {
	return structuredClone(spectacle);
}

type SpectaclesEditionProps = {
	spectacleIds: string[];
	form: SpectacleForm;
	setFormValue: (key: keyof SpectacleForm, value: any) => void;
	isNewSpectacle: boolean;
	onLoadSpectacle: (spectacleId: string) => Promise<void>;
	onDeleteSpectacle: (spectacleId: string) => Promise<void>;
	onDuplicateSpectacle: (spectacleId: string) => Promise<void>;
	onCancelChanges: () => void;

    canCommitChanges: boolean;
	commitChanges: () => Promise<void>;

    isSuperAdmin: boolean;
};

const SpectaclesEdition = (props: SpectaclesEditionProps) => {
	const {
		spectacleIds,
		onLoadSpectacle,
		form,
		setFormValue,
		isNewSpectacle,
        canCommitChanges,
		commitChanges,
		onDeleteSpectacle,
		onDuplicateSpectacle,
		onCancelChanges,
        isSuperAdmin
	} = props;

	const [modified, setModified] = useState(false);

	const handleChange = (key: keyof SpectacleForm, value: any) => {
		setModified(true);
		setFormValue(key, value);
	};

	const handleSave = commitChanges;

	const handleEdit = async (spectacleId: string) => await onLoadSpectacle(spectacleId);

	const handleDelete = async (spectacleId: string) =>
		await onDeleteSpectacle(spectacleId);

	const handleDuplicate = async (spectacleId: string) =>
		await onDuplicateSpectacle(spectacleId);

	const handleCancel = onCancelChanges;

	return (
		<div className="w-full">
			<div className="flex flex-row justify-between items-center mb-6">
				<div className={mergeClasses(layoutClasses.heading1)}>Spectacles</div>
			</div>

			<div className="mb-6">
				{spectacleIds.length === 0 ? (
					<p className="">Aucun spectacle pour l&apos;instant.</p>
				) : (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{spectacleIds.map((spectacleId, index) => (
							<SpectacleCard
								key={`Spectacle-${index.toString().padStart(2, "0")}`}
								spectacleId={spectacleId}
								handleEdit={() => handleEdit(spectacleId)}
								handleDelete={() => handleDelete(spectacleId)}
								handleDuplicate={() => handleDuplicate(spectacleId)}
                                isSuperAdmin={isSuperAdmin}
							/>
						))}
					</div>
				)}
			</div>

			{!(isNewSpectacle && !isSuperAdmin) && <div className="p-4 border rounded flex flex-col items-stretch">
				<h2 className="text-xl font-bold mb-4">
					{isNewSpectacle ? "Ajouter un spectacle" : "Modifier un spectacle"}
				</h2>
				<div className="space-y-4">
					<div>
						<EcorcesLabel>
							Nom{!isNewSpectacle && " (Non modifiable)"}
						</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Nom du spectacle"
							value={form.name}
							setValue={(val) => handleChange("name", val)}
							disabled={!isNewSpectacle}
						/>
					</div>
					<div>
						<EcorcesLabel>Création</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Année de création"
							value={form.ficheTechnique.creation}
							setValue={(val) => handleChange("ficheTechnique", {
                                ...form.ficheTechnique,
                                creation: val
                            } satisfies EcorcesSpectacle["ficheTechnique"])}
						/>
					</div>
					<div>
						<EcorcesLabel>Durée</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Durée du spectacle"
							value={form.ficheTechnique.duree}
							setValue={(val) => handleChange("ficheTechnique", {
                                ...form.ficheTechnique,
                                duree: val
                            } satisfies EcorcesSpectacle["ficheTechnique"])}
						/>
					</div>
					<div>
						<EcorcesLabel>Artistes</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Nombre d'artistes (plus infos éventuelles)"
							value={form.ficheTechnique.artistes}
							setValue={(val) => handleChange("ficheTechnique", {
                                ...form.ficheTechnique,
                                artistes: val
                            } satisfies EcorcesSpectacle["ficheTechnique"])}
						/>
					</div>
					<div>
						<EcorcesLabel>Âge minimal</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Âge minimal"
							value={form.ficheTechnique.age}
							setValue={(val) => handleChange("ficheTechnique", {
                                ...form.ficheTechnique,
                                age: val
                            } satisfies EcorcesSpectacle["ficheTechnique"])}
						/>
					</div>
					<div>
						<EcorcesLabel>Genres</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Théâtre improvisé pluridisciplinaire"
							value={form.ficheTechnique.genres}
							setValue={(val) => handleChange("ficheTechnique", {
                                ...form.ficheTechnique,
                                genres: val
                            } satisfies EcorcesSpectacle["ficheTechnique"])}
						/>
					</div>
                    <div>
                        <EcorcesLabel>Paragraphe 1</EcorcesLabel>
                        <EcorcesTextArea
                            value={form.description.paragraph1}
                            setValue={(val) => handleChange("description", {
                                ...form.description,
                                paragraph1: val
                            } satisfies EcorcesSpectacle["description"])}
                        />
                    </div>
                    <div>
                        <EcorcesLabel>Paragraphe 2</EcorcesLabel>
                        <EcorcesTextArea
                            value={form.description.paragraph2}
                            setValue={(val) => handleChange("description", {
                                ...form.description,
                                paragraph2: val
                            } satisfies EcorcesSpectacle["description"])}
                        />
                    </div>
                    <div>
                        <EcorcesLabel>Paragraphe 3</EcorcesLabel>
                        <EcorcesTextArea
                            value={form.description.paragraph3}
                            setValue={(val) => handleChange("description", {
                                ...form.description,
                                paragraph3: val
                            } satisfies EcorcesSpectacle["description"])}
                        />
                    </div>
					<div>
						<EcorcesLabel>Billetreduc</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Lien vers la page Billetreduc"
							value={form.socials.billetreduc || ""}
							setValue={(val) =>
								handleChange("socials", {
                                    ...form.socials,
                                    billetreduc: val !== "" ? val : undefined
                                } satisfies EcorcesSpectacle["socials"])
							}
						/>
					</div>
                    <div>
						<EcorcesLabel>Affiche</EcorcesLabel>
						<EcorcesImageUploader
							onUpload={(file) => handleChange("affiche", file)}
							file={form.affiche}
                            imageSize={{ width: 1200, height: 900 }}
							destinationFolder="spectacles"
						/>
					</div>
					<div>
						<EcorcesLabel>Teaser</EcorcesLabel>
						<EcorcesTextInput
							placeHolder="Lien vers le teaser"
							value={form.teaser || ""}
							setValue={(val) =>
								handleChange("teaser", val !== "" ? val : undefined)
							}
						/>
					</div>
					<div>
						<EcorcesLabel>Gallery</EcorcesLabel>
						
                        <div className={mergeClasses(
                            "flex flex-row flex-wrap gap-2",
                        )}>
						{form.gallery.map((image, index) => (
							<div key={index} className="mb-2 flex-grow">
								<EcorcesImageUploader
									onUpload={(file) => {
										const newGallery = [...form.gallery];
										newGallery[index] = file;
										handleChange("gallery", newGallery);
									}}
									file={image}
                                    imageSize={{ width: 1200, height: 900 }}
									destinationFolder="spectacles"
								/>
							</div>
						))}
                        </div>
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

type SpectacleCardProps = {
	spectacleId: string;
	handleEdit: () => void;
	handleDelete: () => void;
	handleDuplicate: () => void;
    isSuperAdmin: boolean;
};

const SpectacleCard = (props: SpectacleCardProps) => {
	const { 
        spectacleId,
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
				<div className="font-bold text-xl text-golden">{spectacleId}</div>
			</div>

			<div className="flex flex-row mt-4 space-x-2">
				<EcorcesButton onClick={handleEdit}>Modifier</EcorcesButton>
				<EcorcesButton onClick={handleDelete} disabled={!isSuperAdmin}>Supprimer</EcorcesButton>
				<EcorcesButton onClick={handleDuplicate} disabled={!isSuperAdmin}>Dupliquer</EcorcesButton>
			</div>
		</div>
	);
};

const ExportedSpectaclesManager = () => <EcorcesSuspense>
	<SpectaclesManager />
</EcorcesSuspense>;

export default ExportedSpectaclesManager;