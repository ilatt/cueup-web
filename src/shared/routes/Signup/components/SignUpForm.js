import React, { useState, useRef } from 'react';
import debounce from 'lodash/debounce';
import { localize } from 'react-localize-redux';
import { useMutation, useLazyQuery, useQuery, useApolloClient } from 'react-apollo';
import * as Sentry from '@sentry/browser';
import { SmartButton, Row, Avatar, Col } from 'components/Blocks';
import { Input, InputRow } from 'components/FormComponents';
import { useForm, validators, useValidation } from 'components/hooks/useForm';
import RegistrationElement from 'components/common/RegistrationElement';
import LocationSelector from 'components/common/LocationSelectorSimple';
import ToggleButtonHandler from 'components/common/ToggleButtonHandler';
import ImageUploader from 'components/ImageInput';
import useImageUpload from 'components/hooks/useImageUpload';
import { trackSignup } from 'utils/analytics/autotrack';
import { authService } from 'utils/AuthService';
import useOnLoggedIn from 'components/hooks/useOnLoggedIn';
import NumberedList from '../../../components/common/NumberedList';
import c from '../../../constants/constants';
import GeoCoder from '../../../utils/GeoCoder';
import SimpleMap from '../../../components/common/Map';
import { CREATE_USER, ME } from '../../../components/gql';
import ErrorMessageApollo from '../../../components/common/ErrorMessageApollo';

const isDevelopment = process.env.NODE_ENV === 'development';

const initialState = isDevelopment
    ? {
          genres: [],
          locationName: 'Bali',
          playingRadius: 25000,
          playingLocation: {
              lat: -8.415773,
              lng: 115.182847,
          },
      }
    : { genres: [] };

const SignupForm = ({ translate, reference }) => {
    const onLoggedIn = useOnLoggedIn();

    const [loading, setLoading] = useState(false);
    const [mutate, { error }] = useMutation(CREATE_USER);
    const genreRef = useRef();
    const [state, setState] = useState(initialState);
    const { registerValidation, unregisterValidation, runValidations } = useForm(state);

    const { error: genreError, runValidation: runGenreValidation } = useValidation({
        ref: genreRef,
        validation: validators.required,
        registerValidation: registerValidation('genres'),
        unregisterValidation: unregisterValidation('genres'),
    });

    const setValue = (slice) => setState((s) => ({ ...s, ...slice }));

    const { preview, beginUpload, error: uploadError } = useImageUpload();

    const signup = async (e) => {
        e.preventDefault();

        const errors = runValidations(true);

        if (errors?.length) {
            return;
        }
        try {
            setLoading(true);
            let { name } = state;
            const { playingLocation, playingRadius, locationName, profilePicture } = state;

            const variables = {
                ...state,
                playingLocation: {
                    name: locationName,
                    latitude: playingLocation.lat,
                    longitude: playingLocation.lng,
                    radius: playingRadius,
                },
                reference: reference,
                redirectLink: c.Environment.CALLBACK_DOMAIN,
            };

            if (name) {
                name = name.split(' ');
                variables.lastName = name.pop();
                variables.firstName = name.join(' ');
            }

            if (profilePicture) {
                const { id: pictureId } = await profilePicture;
                variables.profilePicture = pictureId;
            }

            const { data } = await mutate({ variables });
            trackSignup();
            const token = data?.signUpToken?.token;
            if (token) {
                onLoggedIn({ token });
            }
        } catch (err) {
            console.log(err);
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    };

    const updateMap = debounce((location) => {
        //Getting the coordinates of the playing location
        GeoCoder.codeAddress(location, (geoResult) => {
            if (geoResult.error) {
                setValue({
                    locationErr: translate('City not found'),
                    location: null,
                });
            } else {
                setValue({
                    locationName: location,
                    playingLocation: geoResult.position,
                });
            }
        });
    }, 500);

    return (
        <form name={'signup-form'} onSubmit={signup}>
            <NumberedList>
                <RegistrationElement
                    name="email"
                    label="Email*"
                    active={true}
                    text={translate('signup.form.email')}
                >
                    <Input
                        big
                        name="email"
                        placeholder="mail@gmail.com"
                        autoComplete="email"
                        onSave={(email) => setValue({ email })}
                        validation={[validators.required, validators.email]}
                        registerValidation={registerValidation('email')}
                        unregisterValidation={unregisterValidation('email')}
                    />
                </RegistrationElement>

                <RegistrationElement
                    name="password"
                    label="Password*"
                    active={true}
                    text={translate('signup.form.password')}
                >
                    <Input
                        big
                        type="password"
                        name="password"
                        placeholder="Something super secret"
                        onSave={(password) => setValue({ password })}
                        validation={[validators.required, validators.minLength(6)]}
                        registerValidation={registerValidation('password')}
                        unregisterValidation={unregisterValidation('password')}
                    />
                </RegistrationElement>

                <RegistrationElement
                    name="name"
                    label={translate('Name') + '*'}
                    active={true}
                    text={translate('finish-signup.name')}
                >
                    <Input
                        big
                        name="name"
                        autoComplete="name"
                        placeholder={translate('first-last')}
                        onSave={(name) => setValue({ name })}
                        validation={[
                            !isDevelopment && validators.required,
                            !isDevelopment && validators.lastName,
                        ].filter(Boolean)}
                        registerValidation={registerValidation('name')}
                        unregisterValidation={unregisterValidation('name')}
                    />
                </RegistrationElement>

                <RegistrationElement
                    name="artistName"
                    label={translate('Artist name')}
                    active={true}
                >
                    <Input
                        big
                        name="artistName"
                        autoComplete="artistName"
                        placeholder={'DJ ' + (state.name?.split(' ')[0] || 'name')}
                        onSave={(artistName) => setValue({ artistName })}
                    />
                </RegistrationElement>

                <RegistrationElement
                    name="phone"
                    label={translate('Phone') + '*'}
                    active={true}
                    text={translate('finish-signup.phone')}
                >
                    <Input
                        big
                        name="phone"
                        type="tel"
                        placeholder="12345678"
                        autoComplete="tel"
                        onSave={(phone) => setValue({ phone })}
                        validation={[!isDevelopment && validators.required].filter(Boolean)}
                        registerValidation={registerValidation('phone')}
                        unregisterValidation={unregisterValidation('phone')}
                    />
                </RegistrationElement>

                <RegistrationElement
                    name="location"
                    label={translate('Location') + '*'}
                    active={true}
                    text={translate('finish-signup.location')}
                >
                    <LocationSelector
                        big
                        name="playingLocation"
                        autoComplete="shipping locality"
                        onChange={updateMap}
                        validation={[validators.required]}
                        registerValidation={registerValidation('playingLocation')}
                        unregisterValidation={unregisterValidation('playingLocation')}
                    />

                    {state.playingLocation ? (
                        <SimpleMap
                            key={state.locationName}
                            radius={25000}
                            name={'playingLocation'}
                            value={state.playingLocation}
                            editable={true}
                            radiusName="playingRadius"
                            locationName="playingLocation"
                            onCoordinatesChange={(playingLocation) => setValue({ playingLocation })}
                            onRadiusChange={(playingRadius) => setValue({ playingRadius })}
                        />
                    ) : null}
                </RegistrationElement>

                <RegistrationElement
                    name="genres"
                    label={translate('Genres') + '*'}
                    active={true}
                    text={translate('finish-signup.genres')}
                    ref={genreRef}
                >
                    <ToggleButtonHandler
                        name="genres"
                        potentialValues={c.GENRES}
                        onChange={(genres) => {
                            setValue({ genres });
                            runGenreValidation(genres);
                        }}
                        columns={4}
                    />
                    <ErrorMessageApollo error={genreError} />
                </RegistrationElement>

                <RegistrationElement
                    name="picture"
                    label={translate('Picture') + '*'}
                    active={true}
                    text={translate('finish-signup.picture')}
                >
                    <InputRow>
                        {preview && (
                            <Avatar
                                style={{ marginTop: '16px', marginRight: '16px' }}
                                size="extraLarge"
                                src={preview}
                            />
                        )}
                        <ImageUploader
                            half
                            style={{
                                maxWidth: '160px',
                                margin: '0',
                                minWidth: '0',
                                alignSelf: 'center',
                            }}
                            buttonText={preview ? 'Change' : 'Upload'}
                            onSave={(profilePicture) =>
                                setValue({ profilePicture: beginUpload(profilePicture) })
                            }
                            validation={[!isDevelopment && validators.required].filter(Boolean)}
                            registerValidation={registerValidation('profilePicture')}
                            unregisterValidation={unregisterValidation('profilePicture')}
                        />
                    </InputRow>
                    <ErrorMessageApollo error={uploadError} />
                </RegistrationElement>

                <RegistrationElement
                    name="bio"
                    label={translate('About you') + '*'}
                    active={true}
                    text={translate('finish-signup.about')}
                >
                    <Input
                        type="text-area"
                        validate={['required']}
                        style={{ height: '150px' }}
                        name="bio"
                        onSave={(bio) => setValue({ bio })}
                        validation={
                            isDevelopment
                                ? []
                                : [
                                      validators.required,
                                      validators.minLength(100),
                                      validators.containsEmail(
                                          "Email addresses aren't allowed on profiles. Always communicate directly through Cueup"
                                      ),
                                      validators.containsNumber(
                                          "For security phone numbers aren't allowed on profiles. Always communicate directly through Cueup"
                                      ),
                                      validators.containsURL(
                                          "Links to websites aren't allowed on profiles."
                                      ),
                                      validators.containsInstagram(
                                          "Instagram handles aren't allowed on profiles."
                                      ),
                                  ]
                        }
                        registerValidation={registerValidation('bio')}
                        unregisterValidation={unregisterValidation('bio')}
                    />
                </RegistrationElement>
            </NumberedList>

            {!state.msg && (
                <Col middle>
                    <SmartButton
                        glow
                        type="submit"
                        success={state.msg}
                        loading={loading}
                        name="signup"
                    >
                        <div
                            style={{
                                width: '100px',
                            }}
                        >
                            {translate('Join')}
                        </div>
                    </SmartButton>
                    <ErrorMessageApollo error={error} />
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: '10px',
                        }}
                        className="terms_link"
                    >
                        {translate('terms-message')}
                    </p>
                </Col>
            )}

            {state.msg ? (
                <div
                    style={{
                        textAlign: 'center',
                    }}
                >
                    <p
                        style={{
                            fontSize: '20px',
                        }}
                    >
                        {state.msg}
                    </p>
                </div>
            ) : null}
        </form>
    );
};

export default localize(SignupForm, 'locale');
