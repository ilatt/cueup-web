import React, { useRef, useState, useEffect, useCallback } from 'react';
import useComponentSize from '@rehooks/component-size';
import { useMutation, useLazyQuery, useQuery } from 'react-apollo';
import { Icon } from '@iconify/react';
import checkmarkCircle from '@iconify/icons-ion/checkmark-circle';

import styled from 'styled-components';
import { captureException } from '@sentry/core';
import { useParams, Route, useHistory, Switch, useRouteMatch } from 'react-router';
import {
    LoadingIndicator,
    Col,
    RowMobileCol,
    SmartButton,
    TeritaryButton,
} from 'components/Blocks';
import RadioSelect from 'components/RadioSelect';
import { PAYOUT_TYPES, PAYMENT_PROVIDERS } from 'constants/constants';
import { Body, SmallHeader } from 'components/Text';
import useTranslate from 'components/hooks/useTranslate';
import { trackPageView, trackEventPaid } from 'utils/analytics';
import { REQUEST_PAYMENT_INTENT, PAYMENT_CONFIRMED, EVENT_GIGS } from '../../routes/Event/gql';
import TextWrapper from './TextElement';
import MoneyTable, { TableItem } from './MoneyTable';
import StripeFormWrapper from './StripePayForm';
import XenditPayForm from './XenditPayForm';

const BankPayForm = ({
    translate,
    currency,
    loading,
    id,
    currentLanguage,
    onPaymentConfirmed,
    goBack,
    paymentIntent,
    chosenMethod,
}) => {
    console.log({ chosenMethod });

    if (loading) {
        return <LoadingPaymentInitial translate={translate} />;
    }

    const variables = {
        id,
        locale: currentLanguage,
    };

    if (currency) {
        variables.currency = currency;
    }

    const PayForms = {
        STRIPE: (
            <StripeFormWrapper
                onPaymentConfirmed={onPaymentConfirmed}
                paymentIntent={paymentIntent}
                goBack={goBack}
            />
        ),
        XENDIT: (
            <XenditPayForm
                onPaymentConfirmed={onPaymentConfirmed}
                paymentIntent={paymentIntent}
                goBack={goBack}
            />
        ),
        DIRECT: (
            <StripeFormWrapper
                onPaymentConfirmed={onPaymentConfirmed}
                paymentIntent={paymentIntent}
                goBack={goBack}
            />
        ),
    };

    return (
        <div>
            <TextWrapper
                label={
                    paymentIntent.paymentProvider === PAYMENT_PROVIDERS.DIRECT
                        ? translate('Confirm Booking')
                        : translate('Pay')
                }
                showLock={true}
                text={chosenMethod?.description ? null : translate('event:offer.payment-info')}
            />
            {chosenMethod?.description && (
                <>
                    <Body style={{ marginBottom: '12px' }}>
                        You'll only pay a small amount of the offer, and the DJ will handle the rest
                        of the payment. After this payment, the booking is confirmed and you'll
                        receive each others contact information.
                    </Body>
                    <SmallHeader>Directions by the DJ:</SmallHeader>
                    <Body
                        style={{ fontStyle: 'italic', marginBottom: '30px' }}
                    >{`"${chosenMethod?.description}"`}</Body>
                </>
            )}
            {PayForms[paymentIntent.paymentProvider]}
        </div>
    );
};

const PaymentWrapper = (props) => {
    const {
        onPaymentConfirmed,
        currency,
        id,
        event,
        translate,
        match,
        initialMethod,
        availablePayoutMethods,
        currentLanguage,
        gigOffer,
    } = props;

    const [tempPayoutType, settempPayoutType] = useState(initialMethod);
    const div = useRef();
    const history = useHistory();
    const size = useComponentSize(div);

    const goBack = () => {
        history.goBack();
    };

    const chosenMethod = availablePayoutMethods.find((pm) => pm.payoutType === tempPayoutType);

    const { loading, data } = useQuery(REQUEST_PAYMENT_INTENT, {
        onError: captureException,
        skip: !tempPayoutType || !id,
        variables: {
            id,
            currency,
            locale: currentLanguage,
            paymentType: tempPayoutType,
        },
    });

    const { requestPaymentIntent: paymentIntent } = data || {};
    const { amount, offer: paymentOffer } = paymentIntent || {};

    const offer = {
        ...gigOffer,
        ...paymentOffer,
    };

    const payLater = tempPayoutType === PAYOUT_TYPES.DIRECT;

    // const [setPaymentConfirmed] = useMutation(PAYMENT_CONFIRMED, {
    //     variables: {
    //         gigId: id,
    //         eventId: event.id,
    //         amountPaid: offer.totalPayment,
    //         amountLeft: null,
    //     },
    //     onError: captureException,
    // });

    // const handlePaymentConfirmed = useCallback(() => {
    //     setPaymentConfirmed();
    //     onPaymentConfirmed && onPaymentConfirmed();
    //     setIsPaid(true);
    //     try {
    //         trackEventPaid({
    //             currency: currency,
    //             value: amount.amount / 100,
    //         });
    //     } catch (error) {
    //         captureException(error);
    //     }
    // }, [amount, onPaymentConfirmed, setPaymentConfirmed, currency]);

    // if (isPaid) {
    //     return <ThankYouContent style={size} translate={translate} />;
    // }

    return (
        <PayFormContainer className="pay-form" ref={div}>
            <div className="left">
                <Switch>
                    <Route
                        path={match.path}
                        exact
                        render={() => (
                            <PaymentMethodSelect
                                {...props}
                                tempPayoutType={tempPayoutType}
                                settempPayoutType={settempPayoutType}
                                loading={loading}
                            />
                        )}
                    />

                    <Route
                        path={match.path + '/payment'}
                        render={() => (
                            <BankPayForm
                                {...props}
                                loading={loading}
                                chosenMethod={chosenMethod}
                                paymentIntent={paymentIntent}
                                // onPaymentConfirmed={handlePaymentConfirmed}
                                goBack={goBack}
                            />
                        )}
                    />
                </Switch>
            </div>

            <div className="right">
                <MoneyTable>
                    <TableItem label={translate('DJ price')}>{offer.offer?.formatted}</TableItem>
                    {!!payLater && (
                        <TableItem payLater label={<span>{translate('Pay directly to DJ')}</span>}>
                            {offer.totalPayout?.formatted}
                        </TableItem>
                    )}
                    <TableItem
                        data-cy="payment-amount"
                        label={payLater ? 'Payment now' : 'Total'}
                        bold
                    >
                        {loading ? (
                            <LoadingIndicator />
                        ) : amount ? (
                            amount.formatted
                        ) : (
                            offer.totalPayment.formatted
                        )}
                    </TableItem>
                </MoneyTable>

                <p
                    className="terms_link"
                    dangerouslySetInnerHTML={{ __html: translate('event:offer.terms') }}
                />
            </div>
        </PayFormContainer>
    );
};

const LoadingPaymentInitial = ({ translate }) => {
    return (
        <>
            <TextWrapper
                label={translate('Pay')}
                showLock={true}
                text={translate('event:offer.payment-info')}
            />
            <Col center>
                <LoadingIndicator label={translate('gettingPayment')} />
            </Col>
        </>
    );
};

const PaymentMethodSelect = (props) => {
    const history = useHistory();
    const match = useRouteMatch();
    const { translate, tempPayoutType, settempPayoutType } = props;

    return (
        <div>
            <TextWrapper label={translate('Pay-method')} showLock={true} />
            <RadioSelect
                containerStyle={{ marginBottom: '30px' }}
                setChosen={settempPayoutType}
                chosen={tempPayoutType}
                options={[
                    {
                        title: 'Pay now',
                        description:
                            "Cueup will facilitate your payment. We'll keep your money safe until the DJ has played.",
                        value: PAYOUT_TYPES.BANK,
                    },
                    {
                        title: 'Pay later',
                        description:
                            "The DJ will handle the payment, and you'll only pay a small amount now.",
                        value: PAYOUT_TYPES.DIRECT,
                    },
                ]}
            />
            <RowMobileCol right>
                <TeritaryButton onClick={() => history.goBack()}>Go back</TeritaryButton>
                <SmartButton
                    level="primary"
                    data-cy="continue-button"
                    onClick={() => history.push(match.url + '/payment?type=' + tempPayoutType)}
                >
                    Continue
                </SmartButton>
            </RowMobileCol>
        </div>
    );
};

const PayFormContainer = styled.div`
    display: flex;
    flex-wrap: wrap-reverse;
`;

const ThankYouContent = ({ translate, style }) => {
    useEffect(() => {
        try {
            trackPageView('confirm-booking/success');
        } catch (error) {
            captureException(error);
        }
    }, []);

    return (
        <div className="payment-confirmation" style={style}>
            <Icon icon={checkmarkCircle} style={{ fontSize: '42px' }} />
            <h3>{translate('payment-succes-message')}</h3>
        </div>
    );
};

const WithProps = ({ currency, location, ...props }) => {
    const { translate, currentLanguage } = useTranslate();
    const history = useHistory();
    const { gigId, id, hash } = useParams();
    const { data } = useQuery(EVENT_GIGS, { variables: { id, hash, currency } });

    const gigs = data?.event?.gigs || [];
    const gig = gigs.find((g) => g.id === gigId);

    // find out if payment method can be selected
    const { availablePayoutMethods = [] } = gig ?? {};
    const { offer: gigOffer } = gig ?? {};
    const canSelectPayment = availablePayoutMethods.length > 1;

    // Get the current method from url
    // otherwise defaults to bank, otherwise just first one
    const searchParams = new URLSearchParams(location.search);
    const initialType = searchParams.get('type') || PAYOUT_TYPES.BANK;
    const initialMethod = (
        availablePayoutMethods.find((p) => p.payoutType === initialType) ||
        availablePayoutMethods[0]
    )?.payoutType;

    // redirect to payment if only 1 option
    useEffect(() => {
        if (!canSelectPayment) {
            history.replace(location.pathname + '/payment?type=' + initialMethod);
        }
    }, [canSelectPayment, initialMethod, history]);

    return (
        <PaymentWrapper
            {...props}
            id={gigId}
            gig={gig}
            currency={currency}
            translate={translate}
            currentLanguage={currentLanguage}
            canSelectPayment={canSelectPayment}
            availablePayoutMethods={availablePayoutMethods}
            initialMethod={initialMethod}
            gigOffer={gigOffer}
        />
    );
};

export default WithProps;
