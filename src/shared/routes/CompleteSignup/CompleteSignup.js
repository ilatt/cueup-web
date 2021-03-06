import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useQuery } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { ME } from 'components/gql';
import { appRoutes } from 'constants/locales/appRoutes';
import { useServerContext } from 'components/hooks/useServerContext';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import thumbEn from '../../assets/images/signup.png';
import thumbDa from '../../assets/images/signup_da.png';
import ScrollToTop from '../../components/common/ScrollToTop';
import content from '../Signup/content.json';
import Layout from './components/Layout';

const Index = () => {
    const { environment } = useServerContext();

    const { data, loading } = useQuery(ME);
    const { translate, currentLanguage } = useNamespaceContent(content, 'signup');

    if (!loading && !data?.me) {
        return <Redirect to={translate(appRoutes.signUp)} />;
    }

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
            <Layout translate={translate} user={data?.me} loading={loading} />
        </div>
    );
};
// eslint-disable-next-line import/no-unused-modules
export default Index;
