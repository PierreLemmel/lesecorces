import { env } from 'process';
import RedirectTo from '../../../components/redirect/redirect-to';

const RedirectToTest = () => {

    const url = env.CARTE_VISITE_URL || './';

    return <RedirectTo url={url} />;
}

export default RedirectToTest;