import React, { useRef, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import slugify from 'slugify';
import { PrimaryButton, Row, Col, FullWidthCol } from 'components/Blocks';
import { TitleClean, Title, Body } from 'components/Text';
import Footer from '../../components/common/Footer';
import MoneyIcon from '../../components/graphics/Money';
import NoteIcon from '../../components/graphics/Note';
import Map from '../../components/common/Map';
import citySvg from '../../assets/City.svg';
import addTranslate from '../../components/higher-order/addTranslate';
import { Environment } from '../../constants/constants';
import ScrollToTop from '../../components/common/ScrollToTop';
import AsyncRequestForm from '../../components/common/RequestForm';
import FloatingDJs from './components/FloatingCards';
import content from './content.json';
import './index.css';
import { countries } from './locations';
import CountriesList from './components/CountriesList';

const Location = (props) => {
    const themeColor = '#31DAFF';
    const secondColor = '#25F4D2';

    const { match, translate } = props;
    const isMobile = false;
    const title = translate('locationsOverview.title');
    const description = translate('locationsOverview.description');

    // useEffect(() => {
    //     window.countries = countries;
    // }, []);

    return (
        <div className="locations-page">
            <Helmet>
                <title>{title + ' | Cueup'}</title>
                <meta name="description" content={description} />

                <meta property="og:title" content={title + ' | Cueup'} />
                <meta property="og:type" content={'website'} />
                <meta property="og:description" content={description} />

                <meta name="twitter:title" content={title + ' | Cueup'} />
                <meta name="twitter:description" content={description} />
            </Helmet>
            <ScrollToTop />
            <div className="span-wrapper">
                <header
                    style={{
                        height: '500px',
                        backgroundColor: '#ebebeb',
                    }}
                >
                    <Map
                        key={title}
                        noCircle={true}
                        hideRoads={true}
                        radius={4000000}
                        value={{
                            lat: 40.755983,
                            lng: -40.212879,
                        }}
                        height={500}
                        editable={false}
                        themeColor={themeColor}
                        locationName="playingLocation"
                    />
                    <article>
                        <div className="container fix-top-mobile">
                            <div className="col-md-5 col-sm-6">
                                <div className="card">
                                    <h1 key="title">
                                        <b>Locations</b>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </article>
                </header>

                <div className="container">
                    <CountriesList countries={countries} />
                </div>

                <img id="city-illustration" src={citySvg} />
            </div>

            <Footer
                noSkew
                color={secondColor}
                firstTo={translate('routes./signup')}
                secondTo={translate('routes./how-it-works')}
                firstLabel={translate('become-dj')}
                secondLabel={translate('how-it-works')}
                title={translate('are-you-a-dj', { location: title })}
                subTitle={translate('apply-to-become-dj-or-see-how-it-works')}
            />
        </div>
    );
};

export default addTranslate(Location, content);