import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Query, useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { appRoutes } from 'constants/locales/appRoutes.ts';
import Navlink from '../common/Navlink';
import Login from '../common/Login';
import Logo from '../common/Logo';
import BreadCrumbs from '../BreadCrumbs';
import EmailVerifier from '../EmailVerifier';
import { ME } from '../gql';
import Popup from '../common/Popup';
import InstagramConnect from '../InstagramConnect';
import { LoadingIndicator } from '../Blocks';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

const Menu = () => {
    const { t } = useTranslation();
    const [loginExpanded, setLoginExpanded] = useState(false);

    useEffect(() => {
        const parsedUrl = new URL(window.location.href);
        const showLogin = parsedUrl.searchParams.get('showLogin');

        if (showLogin) {
            setLoginExpanded(true);
        }
    }, [setLoginExpanded]);

    const { loading, data } = useQuery(ME);
    const { me: user } = data || {};
    const loggedIn = !!user;

    const isPro = user?.appMetadata?.isPro;

    return (
        <div className="menu-wrapper">
            <EmailVerifier onVerified={() => setLoginExpanded(true)} />
            <InstagramConnect />

            <div className="container">
                <div className={'nav-container location_'}>
                    <nav className="navigation">
                        <div className="logo-area">
                            <Navlink to={t(appRoutes.home)}>
                                <Logo />
                            </Navlink>
                            <BreadCrumbs />
                        </div>

                        <MobileMenu />
                        <ul className="main-menu">
                            {loggedIn && !isPro && (
                                <li>
                                    <Navlink
                                        label={'Go Pro'}
                                        to={
                                            t(appRoutes.userSettings).replace(
                                                ':permalink',
                                                user.permalink
                                            ) + '/get-pro'
                                        }
                                    />
                                </li>
                            )}

                            <li>
                                <Navlink
                                    to={t(appRoutes.howItWorks)}
                                    label={t('how-it-works')}
                                    important="true"
                                />
                            </li>

                            {loggedIn ? null : (
                                <li>
                                    <Navlink
                                        to={t(appRoutes.becomeDj)}
                                        label={t('become-a-dj')}
                                        important="true"
                                    />
                                </li>
                            )}
                            {loggedIn ? null : (
                                <li>
                                    <Navlink
                                        to={t(appRoutes.signUp)}
                                        label={t('sign up')}
                                        important="true"
                                    />
                                </li>
                            )}

                            {!loggedIn && !loading ? (
                                <li>
                                    <button
                                        className="link-look"
                                        data-cy="login-button"
                                        onClick={() => setLoginExpanded((s) => !s)}
                                    >
                                        {t('login')}
                                    </button>
                                    <Popup
                                        width={'568px'}
                                        showing={loginExpanded}
                                        onClickOutside={() => setLoginExpanded(false)}
                                    >
                                        <Login
                                            onLogin={() => setLoginExpanded(false)}
                                            user={user}
                                        />
                                    </Popup>
                                </li>
                            ) : null}

                            {loggedIn ? (
                                <li>
                                    <DesktopMenu user={user} />
                                </li>
                            ) : null}

                            {loading ? (
                                <li>
                                    <LoadingIndicator />
                                </li>
                            ) : null}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

const SmartNavigation = withRouter(Menu);

export default SmartNavigation;
