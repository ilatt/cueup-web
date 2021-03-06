import React, { useState } from 'react';
import { useCheckDjAvailability } from 'actions/EventActions';
import { BodySmall } from 'components/Text';
import { useLazyLoadScript } from 'components/hooks/useLazyLoadScript';
import { Row, SmartButton } from '../../Blocks';
import { Input } from '../../FormComponents';
import LocationSelector from '../LocationSelectorSimple';
import DatePicker from '../DatePicker';
import ErrorMessageApollo from '../ErrorMessageApollo';
import { RequestSection } from './RequestForm';

const Step1 = ({
    translate,
    form,
    next,
    handleChange,
    registerValidation,
    unregisterValidation,
    runValidations,
    countries,
}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [message, setMessage] = useState();
    const [check, { loading, error }] = useCheckDjAvailability(form);

    const [loadGoogleMaps, { started }] = useLazyLoadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
    );

    const dateChanged = (date) => {
        handleChange({ date });
        setShowDatePicker(false);
    };

    const submit = async (e) => {
        e.preventDefault();
        const errors = runValidations();

        if (errors.length === 0) {
            const { result, date, timeZoneId, location } = await check(form);
            if (result === true) {
                next({
                    ...form,
                    date,
                    timeZoneId,
                    location,
                });

                //not available
            } else {
                setMessage(translate('requestForm:no-djs-message'));
            }
        }
    };

    // handle both moment and js date
    const eventDateString =
        typeof form.date?.format === 'function'
            ? form.date.format('dddd Do, MMMM YYYY')
            : typeof form.date?.toLocaleDateString === 'function'
            ? form.date?.toLocaleDateString()
            : null;
    return (
        <form name="requestForm-step-1" onSubmit={submit}>
            <h3 className="center">{translate('requestForm:step-1.header')}</h3>

            {showDatePicker ? (
                <DatePicker dark initialDate={form.date} handleChange={dateChanged} />
            ) : (
                <div
                    onMouseOver={() => {
                        DatePicker.preload();
                        if (!started) {
                            loadGoogleMaps();
                        }
                    }}
                >
                    <RequestSection style={{ position: 'relative', zIndex: 5 }}>
                        <LocationSelector
                            noShadow
                            data-cy={'location-input'}
                            countries={countries}
                            forceHeight
                            name="query"
                            label={translate('requestForm:step-1.event-location')}
                            placeholder={translate('requestForm:step-1.event-location-placeholder')}
                            onSave={(locationName) => handleChange({ locationName })}
                            validation={(v) => (v ? null : 'Please select a location')}
                            registerValidation={registerValidation('locationName')}
                            unregisterValidation={unregisterValidation('locationName')}
                            defaultValue={form.locationName}
                        >
                            <BodySmall>
                                {translate('requestForm:step-1.event-location-description')}
                            </BodySmall>
                        </LocationSelector>
                    </RequestSection>
                    <RequestSection
                        onClick={() => {
                            setShowDatePicker(true);
                        }}
                    >
                        <Input
                            data-cy="date-input"
                            type="text"
                            name="date"
                            placeholder="Select date"
                            label={translate('requestForm:step-1.event-date')}
                            disabled
                            labelStyle={{
                                cursor: 'pointer',
                            }}
                            style={{
                                pointerEvents: 'none',
                                zIndex: 2,
                                position: 'relative',
                            }}
                            value={eventDateString}
                            validation={(v) => (v ? null : 'Please select a date')}
                            registerValidation={registerValidation('date')}
                            unregisterValidation={unregisterValidation('date')}
                        >
                            <BodySmall>
                                {translate('requestForm:step-1.event-date-description')}
                            </BodySmall>
                        </Input>
                    </RequestSection>
                    <Row right>
                        {error && <ErrorMessageApollo error={error} />}
                        {message && (
                            <BodySmall style={{ marginTop: '5px' }} className={'center'}>
                                {message}
                            </BodySmall>
                        )}
                        <SmartButton type="submit" onClick={submit} loading={loading}>
                            {translate('continue')}
                        </SmartButton>
                    </Row>
                </div>
            )}
        </form>
    );
};

export default Step1;
