"use client";

import RedirectTo from '../../../../components/redirect/redirect-to';
import { useParams } from 'next/navigation';
import { getDocument } from '../../../../lib/firebase';
import { useEffect, useState } from 'react';
import { useEffectAsync } from '../../../../lib/hooks';

const Redirect = () => {

    const params = useParams();
    const key = params["key"] as string;

    const [url, setUrl] = useState<string | null>(null);

    useEffectAsync(async () => {

        if (!key) {
            return;
        }

        const links = await getDocument<Record<string, string>>("/links/default")
        const newUrl = links[key.toLowerCase()];

        setUrl(newUrl);
    }, [key])


    if (url) {
        return <RedirectTo url={url} />;
    }
    else {
        return <div>Redirecting...</div>;
    }
}

export default Redirect;