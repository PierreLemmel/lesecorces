"use client";

import { useMemo, useState } from "react";
import EcorcesCheckbox from "../../components/ui/ecorces-checkbox";
import { TextLink } from "../../components/ui/text-link";
import { mergeClasses } from "../../lib/utils";

const superAdminStr = "?superadmin=true";

const BackOfficePage = () => {

    const [superAdmin, setSuperAdmin] = useState<boolean>(false);
    const searchParams = useMemo(() => superAdmin ? superAdminStr : "", [superAdmin]);

    return <div className={mergeClasses(
        "flex flex-col gap-4"
    )}>
        <TextLink href={"/bo/blocks" + searchParams} className="text-lg">Blocks</TextLink>
        <TextLink href={"/bo/activites" + searchParams} className="text-lg">Activités</TextLink>
        <TextLink href={"/bo/offre-pedagogique" + searchParams} className="text-lg">Offres pédagogiques</TextLink>
        <TextLink href={"/bo/membres" + searchParams} className="text-lg">Membres</TextLink>
        <TextLink href={"/bo/amis" + searchParams} className="text-lg">Ami-e-s</TextLink>
        <TextLink href={"/bo/partenaires" + searchParams} className="text-lg">Partenaires</TextLink>
        <TextLink href={"/bo/newsletter" + searchParams} className="text-lg">Newsletter</TextLink>
        
        <div className="flex flex-row gap-2 items-center">
            <div>Super admin :</div>
            <EcorcesCheckbox
                checked={superAdmin}
                onChange={setSuperAdmin}
            />
        </div>
    </div>
}

export default BackOfficePage;