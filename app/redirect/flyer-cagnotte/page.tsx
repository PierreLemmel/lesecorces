import { env } from 'process';
import RedirectTo from '../../../components/redirect/redirect-to';

const RedirectToTest = () => {

    const url = env.FLYER_CAGNOTTE_URL || './';

    return <RedirectTo url={url} />;
}

export default RedirectToTest;