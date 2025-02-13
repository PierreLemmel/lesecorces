"use client";

import { useSearchParams } from "next/navigation";
import EcorcesSuspense from "../../../components/ui/ecorces-suspense";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { archiveNewsLetterMails, getArchiveNewsLetterMails, getNewsLetterMails, NewsLetterData } from "../../../server/server";
import { mergeClasses } from "../../../lib/utils";
import EcorcesButton from "../../../components/ui/ecorces-button";
import EcorcesCheckbox from "../../../components/ui/ecorces-checkbox";
import { useEffectAsync } from "../../../lib/hooks";

const NewsLetterEdit = () => {

    const searchParams = useSearchParams();
    const isSuperAdmin = searchParams.get("superadmin")?.toLowerCase() === "true";

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [defaultData, setDefaultData] = useState<NewsLetterData | null>(null);
    const [archiveData, setArchiveData] = useState<NewsLetterData | null>(null);

    useEffectAsync(async () => {

        setIsLoading(true);
        
        const [defaultResult, archiveResult] = await Promise.all([
            getNewsLetterMails(),
            getArchiveNewsLetterMails()
        ])

        setDefaultData(defaultResult);
        setArchiveData(archiveResult);

        setIsLoading(false);
    })

    const handleArchiveData = async () => {
        setIsSaving(true);

        const { archiveData, defaultData } = await archiveNewsLetterMails();

        setDefaultData(defaultData);
        setArchiveData(archiveData);

        setIsSaving(false);
    }

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

    if (!archiveData || !defaultData) {
        throw new Error("Missing data");
    }

    const props: NewsLetterEditionProps = {
        superAdmin: isSuperAdmin,
        archiveData,
        defaultData,
        handleArchiveData
    }

    return <NewsLetterEdition {...props} />
}

type NewsLetterEditionProps = {
    superAdmin: boolean;
    archiveData: NewsLetterData;
    defaultData: NewsLetterData;
    handleArchiveData: () => void;
}

const NewsLetterEdition = (props: NewsLetterEditionProps) => {
    const {
        superAdmin,
        archiveData,
        defaultData,
        handleArchiveData
    } = props;

    const [showArchive, setShowArchive] = useState(false);

    return <div className={mergeClasses(
        "flex flex-col items-stretch",
        "gap-4"
    )}>
        <div className="heading-1">Mails</div>
        <div className={mergeClasses(
            "flex flex-col gap-2",
            "pl-2"
        )}>
            {defaultData.mails.length > 0  ? defaultData.mails.map((mail, index) => <div
                key={`default-${index.toString().padStart(3, "0")}`}
                className="text-white"
            >{mail}</div>) : <div className="text-white text-xl">Aucun mail à afficher</div>}
        </div>
        <div>
            <EcorcesButton
                onClick={() => handleArchiveData()}
                disabled={!superAdmin || defaultData.mails.length === 0}
            >
                Archiver
            </EcorcesButton>
        </div>
        
        <div className="heading-1 mt-10">Archive</div>
        <div className="flex flex-row gap-2 items-center">
            <EcorcesCheckbox
                checked={showArchive}
                onChange={setShowArchive}
            />
            <div>{showArchive ? "Masquer" : "Afficher"} les mails archivés</div>
        </div>
        {showArchive && <div className={mergeClasses(
            "flex flex-col gap-2",
            "pl-2"
        )}>
            {archiveData.mails.length > 0 ? archiveData.mails.map((mail, index) => <div
                key={`archive-${index.toString().padStart(3, "0")}`}
                className="text-white"
            >{mail}</div>) : <div className="text-white text-xl">Aucun mail archivé</div>}
        </div>}
    </div>
}

const ExportedNewsLetterEdit = () => <EcorcesSuspense>
    <NewsLetterEdit />
</EcorcesSuspense>;

export default ExportedNewsLetterEdit;