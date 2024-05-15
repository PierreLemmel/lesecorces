'use client';

import RedirectTo from '../../../../components/redirect/redirect-to';
import { useParams } from 'next/navigation';

const urls: Record<string, string> = {
    'carte-visite': 'https://www.proarti.fr/collect/project/quelque-chose-a-change-dans-lair/0',
    'flyer-avignon': 'https://lafactory.vostickets.net/billet/FR/representation-LA_FACTORY-21994-0.wb',
    'flyer-cagnotte': 'https://www.proarti.fr/collect/project/quelque-chose-a-change-dans-lair/0',
    'kakemono': 'https://www.proarti.fr/collect/project/quelque-chose-a-change-dans-lair/0',
};

const RedirectToTest = () => {

    const params = useParams();
    const key = params["key"] as string;

    if (key && urls[key.toLowerCase()]) {
        const url = urls[key.toLowerCase()];
        return <RedirectTo url={url} />;
    }
}

export default RedirectToTest;