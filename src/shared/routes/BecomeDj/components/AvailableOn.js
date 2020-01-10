import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';

const Bg = styled.div`
    width: 100vw;
`;

const AvailableOn = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <Row center />
            </Container>
        </Bg>
    );
};

export default addTranslate(AvailableOn, content);
