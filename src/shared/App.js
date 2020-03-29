/* eslint-disable import/first */
import React, { memo, useState, useEffect, useCallback } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactPixel from 'react-facebook-pixel';

import LazyBecomeDj from 'routes/BecomeDj';
import LazyHowItWorks from 'routes/HowItWorks';
import * as gtag from './utils/analytics/autotrack';
import { Environment } from './constants/constants';
import Home from './routes/Home';
import About from './routes/About';
import CueupEvent from './routes/Event';
import Gig from './routes/Gig';
import Signup from './routes/Signup';
import CompleteSignup from './routes/CompleteSignup';
import User from './routes/User';
import Faq from './routes/Faq';
import Terms from './routes/Terms';
import LocationLanding, { LazyLocationsOverview } from './routes/Location';
import NotFound from './routes/NotFound';
import defaultImage from './assets/images/default.png';
import defaultImageDa from './assets/images/default_da.png';
import Blog from './routes/Blog';
import ErrorHandling from './components/common/ErrorPage';
import Navigation from './components/Navigation';
import { getTranslatedURL } from './utils/HelperFunctions';
import ResetPassword from './routes/ResetPassword';
import { MobileMenuContext } from './components/MobileMenu';
import BottomPlayer from './routes/User/routes/Sounds/BottomPlayer';
import './css/style.css';

let redirected = false;

const compareRoutes = (r1 = [], r2 = [], key = 'route') => {
    // eslint-disable-next-line security/detect-object-injection
    return r1.every((v, idx) => r2[idx] && v[key] === r2[idx][key]);
};

const App = (props) => {
    const { location, translate, activeLanguage, setActiveLanguage } = props;

    // eslint-disable-next-line no-unused-vars
    const setLanguage = useCallback(setActiveLanguage, []);

    const url = location.pathname;
    const urlLocale = url.split('/')[1] === 'dk' ? 'da' : 'en';
    // eslint-disable-next-line no-unused-vars
    const language = urlLocale;
    const redirect = false;

    const [state, setState] = useState({
        mobileLinks: [],
    });

    // useEffect(() => {
    //     setLanguage(language);
    // }, [language, setLanguage]);

    useEffect(() => {
        // Setup custom analytics
        if (process.env.NODE_ENV !== 'development') {
            gtag.init();
            ReactPixel.init(Environment.PIXEL_ID);
        }
    }, []);

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') {
            setTimeout(() => {
                gtag.pageView(location.pathname);
                ReactPixel.pageView();
            }, 100);
        }
    }, [location.pathname]);

    const registerMobileLinks = useCallback(
        (routes, mobileLabel) => {
            setState((state) => {
                const { mobileLinks } = state;
                if (!compareRoutes(routes, mobileLinks)) {
                    let newLinks = mobileLinks.filter(
                        (l) => !routes.map((r) => r.route).includes(l.route)
                    );
                    newLinks = [...newLinks, ...routes];

                    return { ...state, mobileLinks: newLinks, mobileLabel };
                }
                return state;
            });
        },
        [setState]
    );

    const unregisterMobileLinks = useCallback(
        (routes) => {
            setState((state) => {
                const { mobileLinks } = state;
                const newLinks = mobileLinks.filter(
                    (l) => !routes.map((r) => r.route).includes(l.route)
                );
                if (!compareRoutes(mobileLinks, newLinks)) {
                    return {
                        ...state,
                        mobileLinks: newLinks,
                    };
                }
                return state;
            });
        },
        [setState]
    );

    if (!!redirect && location.pathname !== redirect && !redirected) {
        redirected = true;
        return <Redirect to={redirect} />;
    }

    const thumb = activeLanguage === 'da' ? defaultImageDa : defaultImage;
    const title = translate('Book DJs with ease') + ' | Cueup';
    const description = translate('site-description');
    const urlArr = url.split('/');
    let cssLocation = urlArr[1] === 'dk' ? urlArr[2] : urlArr[1];
    cssLocation = `location_${cssLocation || ''}`;
    const pageURL = Environment.CALLBACK_DOMAIN + location.pathname;
    const altLangURL =
        Environment.CALLBACK_DOMAIN +
        getTranslatedURL(url, translate('code.' + activeLanguage), translate);

    return (
        <ErrorHandling>
            <div className={cssLocation}>
                <Helmet>
                    <link
                        rel="alternate"
                        href={altLangURL}
                        hrefLang={translate('hreflang.' + activeLanguage)}
                    />

                    <title>{title}</title>

                    <meta name="description" content={description} />
                    <meta
                        name="keywords"
                        content="dj, book, rent, copenhagen, cueup, music, events, party, wedding, birthday"
                    />

                    <meta property="og:url" content={pageURL} />
                    <meta property="fb:app_id" content={Environment.FACEBOOK_ID} />
                    <meta property="og:title" content={title} />
                    <meta property="og:description" content={description} />
                    <meta property="og:image" content={thumb} />

                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@@CueupDK" />
                    <meta name="twitter:creator" content="@@CueupDK" />
                    <meta name="twitter:title" content={title} />
                    <meta name="twitter:description" content={description} />
                    <meta name="twitter:image" content={thumb} />
                    <meta name="twitter:url" content={pageURL} />
                </Helmet>
                <MobileMenuContext.Provider
                    value={{
                        routes: state.mobileLinks,
                        unregisterRoutes: unregisterMobileLinks,
                        registerRoutes: registerMobileLinks,
                        label: state.mobileLabel,
                    }}
                >
                    <RouteWrapper translate={translate} cssLocation={cssLocation} />
                </MobileMenuContext.Provider>
                <div id="popup-container" />
            </div>
        </ErrorHandling>
    );
};

const RouteWrapper = memo(({ translate, cssLocation }) => {
    return (
        <>
            <Navigation />
            <div id="content" className={cssLocation}>
                <Switch>
                    <Route exact path={[translate('routes./'), '/verifyEmail']} component={Home} />
                    <Route path={translate('routes./about')} component={About} />
                    <Route path={[translate('routes./user/:permalink')]} component={User} />
                    <Route path={translate('routes./become-dj')} component={LazyBecomeDj} />
                    <Route path={translate('routes./how-it-works')} component={LazyHowItWorks} />
                    <Route path={translate('routes./signup')} component={Signup} />
                    <Route path={'/complete-signup'} component={CompleteSignup} />
                    <Route path={translate('routes./faq')} component={Faq} />
                    <Route path={translate('routes./terms')} component={Terms} />
                    <Route
                        path={translate('routes./event') + '/:id/:hash'}
                        component={CueupEvent}
                    />
                    <Route path={translate('routes./gig') + '/:id'} component={Gig} />
                    <Route
                        path={translate('routes./book-dj') + '/:country/:city?'}
                        component={LocationLanding}
                    />
                    <Route path={translate('routes./book-dj')} component={LazyLocationsOverview} />
                    <Route path={translate('routes./blog')} component={Blog} />
                    <Route path={translate('routes./reset-password')} component={ResetPassword} />

                    <Route component={NotFound} />
                </Switch>

                <BottomPlayer />
            </div>
        </>
    );
});

export default withRouter(App);
