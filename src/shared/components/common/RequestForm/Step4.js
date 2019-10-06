import React from 'react';
import emailValidator from 'email-validator';
import { Row, TeritaryButton, PrimaryButton } from 'components/Blocks';
import { BodySmall } from 'components/Text';
import { Input } from 'components/FormComponents';
import addTranslate from 'components/higher-order/addTranslate';

const Step4 = ({
    translate,
    form,
    next,
    back,
    handleChange,
    registerValidation,
    unregisterValidation,
}) => {
    return (
        <div>
            <form>
                <h3>{translate('request-form.step-4.header')}</h3>
                <section>
                    <Input
                        label={translate('request-form.step-4.contact-name')}
                        name="contactName"
                        placeholder={translate('first-last')}
                        type="text"
                        autoComplete="name"
                        defaultValue={form.contactName}
                        validation={(v) => {
                            if (!v) {
                                return 'Please enter name';
                            }
                            const [firstName, ...lastName] = v.split(' ');
                            if (!firstName || !lastName.some((s) => !!s.trim())) {
                                return 'Please enter both first and last name';
                            }
                        }}
                        required
                        onSave={(contactName) => handleChange({ contactName })}
                        registerValidation={registerValidation('contactName')}
                        unregisterValidation={unregisterValidation('contactName')}
                    />
                    <BodySmall>
                        {translate('request-form.step-4.contact-name-description')}
                    </BodySmall>
                </section>

                <section>
                    <Input
                        type="tel"
                        label={translate('request-form.step-4.contact-phone')}
                        placeholder={translate('optional')}
                        name="contactPhone"
                        defaultValue={form.contactPhone}
                    />
                    <BodySmall>
                        {translate('request-form.step-4.contact-phone-description')}
                    </BodySmall>
                </section>
                <section>
                    <Input
                        type="email"
                        name="contactEmail"
                        label={translate('request-form.step-4.contact-email')}
                        autoComplete="email"
                        placeholder="Email"
                        defaultValue={form.contactEmail}
                        validation={(v) =>
                            emailValidator.validate(v) ? null : 'Not a valid email'
                        }
                        onSave={(contactEmail) => handleChange({ contactEmail })}
                        registerValidation={registerValidation('contactEmail')}
                        unregisterValidation={unregisterValidation('contactEmail')}
                    />
                    <BodySmall>
                        {translate('request-form.step-4.contact-email-description')}
                    </BodySmall>
                </section>
                <Row right style={{ marginTop: '12px' }}>
                    <TeritaryButton type="button" className="back-button" onClick={back}>
                        {translate('back')}
                    </TeritaryButton>
                    <PrimaryButton type="button" onClick={next}>
                        {translate('get-offers')}
                    </PrimaryButton>
                </Row>
            </form>
        </div>
    );
};

export default addTranslate(Step4);
