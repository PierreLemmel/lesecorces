'use client';

import RedirectTo from '../../../../components/redirect/redirect-to';
import { useParams } from 'next/navigation';

const URL_PROARTI = 'https://www.proarti.fr/collect/project/quelque-chose-a-change-dans-lair/0';
const URL_FACTORY_AVIGNON = 'https://lafactory.vostickets.net/billet/FR/representation-LA_FACTORY-21994-0.wb';
const URL_FACTORY_SORTIE_RESIDENCE = 'https://www.theatredeloulle.com/quelque-chose-a-change-dans-lair/';

const urls: Record<string, string> = {
    'carte-visite': URL_PROARTI,
    'flyer-avignon': URL_FACTORY_AVIGNON,
    'flyer-cagnotte': URL_FACTORY_SORTIE_RESIDENCE,
    'kakemono': URL_FACTORY_SORTIE_RESIDENCE,
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