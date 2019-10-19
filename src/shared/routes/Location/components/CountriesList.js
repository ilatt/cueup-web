import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Title, Body, TitleClean } from 'components/Text';
import { Row, Col } from 'components/Blocks';

const CountriesList = ({ countries }) => {
    return (
        <FormRow middle center>
            <Overview>
                {Object.entries(countries).map(([countrySlug, { cities, name }], idx) => (
                    <ul key={countrySlug}>
                        <Title style={{ textTransform: 'capitalize' }}>{name}</Title>
                        {cities.map((city, idx) => (
                            <li key={idx}>
                                <NavLink to={`/book-dj/${countrySlug}/${city.slug}`}>
                                    <Body>DJs in {city.cityascii}</Body>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                ))}
            </Overview>
        </FormRow>
    );
};

export const CitiesList = ({ cities, country, countrySlug }) => {
    return (
        <>
            <FormRow middle center>
                <TitleClean>Other locations in {country.name}</TitleClean>
                <Overview>
                    <ul>
                        {cities.map((city, idx) => (
                            <li key={idx}>
                                <NavLink to={`/book-dj/${countrySlug}/${city.slug}`}>
                                    <Body>{city.cityascii}</Body>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </Overview>
            </FormRow>
        </>
    );
};

const FormRow = styled(Col)`
    margin: 60px 0;
    width: 100%;
    padding-left: 200px;
    @media only screen and (max-width: 768px) {
        padding-left: 0px;
    }
`;

const Overview = styled.div`
    columns: 4;
    ul {
        margin-top: 0;
        margin-bottom: 16px;
        width: 200px;
        margin-right: 16px;
    }
`;

export default CountriesList;
