import React, { Component } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';
// import { findByLabelText } from '@testing-library/react';
import Footer from 'components/common/Footer';
import { TextAccent } from 'routes/BecomeDj/components/blocks/TextAccent';
import PaymentCards from 'components/common/PaymentCards';
import JoinThousands from 'components/common/JoinThousands';
import { Header } from 'components/common/Text';
import addTranslate from '../../components/higher-order/addTranslate';
import thumbEn from '../../assets/images/signup.png';
import thumbDa from '../../assets/images/signup_da.png';
import { Environment } from '../../constants/constants';
import ScrollToTop from '../../components/common/ScrollToTop';
import Hero from '../../components/common/Hero';
import { Title } from '../../components/common/Title';
import { SubTitle } from '../../components/common/SubTitle';
import { Body } from '../../components/Text';
import { ReadMore, Container, Col } from '../../components/Blocks';
import HighlightsLaptop from '../../components/common/HighlightsLaptop';
import HowItWorksCards from './components/HowItWorksCards';

const Bg = styled.div`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    z-index: -10;
    border-radius: 0 0 50% 50%;
    display: flex;
    justify-self: center;
    width: 160vw;
    margin: 0 -30vw 0 -30vw;
    overflow: hidden;
    @media only screen and (max-width: 768px) {
        width: 300vw;
        margin: 0 -100vw 0 -100vw;
    }
`;
const Bg2 = styled.div`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    z-index: -10;
    padding: 80px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Spacer = styled.div`
    height: ${({ height }) => (height ? height : '0px')};
`;

const CustomCol = styled(Col)`
    margin-top: 100px;
    margin-bottom: -60px;
`;
class Index extends Component {
    render() {
        const { translate, currentLanguage } = this.props;
        const title = 'How it works | Cueup';
        const thumb = Environment.CALLBACK_DOMAIN + (currentLanguage === 'da' ? thumbDa : thumbEn);
        const themeColor = '#00d1ff';
        return (
            <>
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
                <Bg>
                    <Hero
                        blueAccent="BOOKING A DJ"
                        firstTo={translate('routes./')}
                        titleLine1="How it works"
                        heroContent={<HowItWorksCards />}
                        heroButtonText="Find a DJ"
                    />
                    {/* <div style={{ height: '1000px' }} />> */}
                </Bg>
                <CustomCol>
                    <TextAccent center>DJ PROFILE</TextAccent>
                    <Header blue center>
                        Get an overview
                    </Header>
                </CustomCol>
                <HighlightsLaptop
                    blue
                    text1Row1="Direct"
                    text1Row2="Message"
                    text2Row1="Listen to"
                    text2Row2="Mixes"
                    text3Row1="See"
                    text3Row2="Pictures"
                    text4Row1="Check"
                    text4Row2="Reviews"
                    margin="50px 0 70px 0"
                />
                <Bg2>
                    <Container>
                        <Col>
                            <TextAccent center>PAYMENT</TextAccent>
                            <Header white center largeMargin>
                                Money back{'\n'}guarentee
                            </Header>
                            <SubTitle white>
                                Tum dicere exorsus est laborum et via procedat oratio quaerimus
                                igitur, inquit, sic agam, ut aliquid ex ea voluptate et rationibus
                                confirmare.
                            </SubTitle>
                            <NavLink
                                to="/"
                                style={{
                                    marginTop: '42px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <ReadMore white size="18px" uppercase={false}>
                                    Arrange event
                                </ReadMore>
                            </NavLink>
                        </Col>
                    </Container>
                    <Container>
                        <PaymentCards margin="70px 0 -450px 0" />
                    </Container>
                </Bg2>
                <Spacer height="400px" />
                <JoinThousands
                    title={'find the perfect DJ'}
                    description={
                        'Cueup is a growing community that gathers thousands of the most talented DJs, all around the world. \n Find the best DJ for your event, and book him now.'
                    }
                    to={translate('routes./')}
                    label="Find a DJ"
                />
                <Spacer height="50px" />
                <Footer
                    color={themeColor}
                    firstTo={translate('routes./signup')}
                    secondTo={translate('routes./blog')}
                    firstLabel={translate('Sign up')}
                    secondLabel={translate('Blog')}
                    title={translate('Ready to get started?')}
                    subTitle={translate('Apply to become DJ now, or read our blog.')}
                />
            </>
        );
    }
}

// export default addTranslate(Index, content);
export default addTranslate(Index);
