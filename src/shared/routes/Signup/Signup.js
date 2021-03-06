import React from 'react';
import { Helmet } from 'react-helmet-async';

import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { useServerContext } from 'components/hooks/useServerContext';
import thumbEn from '../../assets/images/signup.png';
import thumbDa from '../../assets/images/signup_da.png';
import ScrollToTop from '../../components/common/ScrollToTop';
import Signup from './components/Signup';
import content from './content.json';

const Index = () => {
    const { environment } = useServerContext();

    const { translate, currentLanguage } = useNamespaceContent(content, 'signup');
    const title = translate('apply-to-become-dj') + ' | Cueup';
    const thumb = environment.CALLBACK_DOMAIN + (currentLanguage === 'da' ? thumbDa : thumbEn);

    return (
        <div>
            <Helmet>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="twitter:title" content={title} />

                <meta property="og:image" content={thumb} />
                <meta name="twitter:image" content={thumb} />
                <meta
                    name="apple-itunes-app"
                    content="app-id=1458267647, app-argument=userProfile"
                />
            </Helmet>
            <ScrollToTop />
            <Signup translate={translate} />
        </div>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default Index;
