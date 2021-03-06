import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { withTranslation, useTranslation } from 'react-i18next';
import { appRoutes } from 'constants/locales/appRoutes.ts';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import ScrollToTop from '../../components/common/ScrollToTop';
import Faq from './components/Faq';
import Dj from './routes/DJ';
import Organizer from './routes/Organizer';
import content from './content.json';

const Index = (props) => {
    const { match, t } = props;
    useNamespaceContent(content, 'faq');

    const title = 'FAQ | Cueup';

    return (
        <Faq {...props}>
            <Helmet>
                <body className="white-theme" />
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="twitter:title" content={title} />
            </Helmet>
            <ScrollToTop />
            <Switch>
                <Route
                    path={t(appRoutes.faqDj)}
                    render={(props) => <Dj {...props} translate={t} />}
                />
                <Route
                    path={t(appRoutes.faqOrganizer)}
                    render={(props) => <Organizer {...props} translate={t} />}
                />
                <Redirect exact from={`${match.url}`} to={t(appRoutes.faqDj)} />
            </Switch>
        </Faq>
    );
};
// eslint-disable-next-line import/no-unused-modules
export default withTranslation()(Index);
