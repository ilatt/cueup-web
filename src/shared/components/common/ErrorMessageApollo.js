import React from 'react';
import { Mutation } from 'react-apollo';
import { useServerContext } from 'components/hooks/useServerContext';
import { REQUEST_EMAIL_VERIFICATION } from '../gql';

export const handleError = (error) => {
    const msg = getErrorMessage(error);

    if (msg) {
        window.alert(msg);
    }
};

export const getErrorMessage = (error) => {
    let msgs = 'There was an error';

    if (!error) {
        return null;
    }
    if (typeof error === 'string') {
        msgs = error;
    }

    const { graphQLErrors } = error;

    if (error.message && !graphQLErrors) {
        return error.message;
    }

    if (graphQLErrors && graphQLErrors.length > 0) {
        graphQLErrors.map((e) => (msgs = e.message));
    }

    return msgs;
};

const ErrorMessageApollo = ({ style, error, center, email, onFoundCode }) => {
    let msgs = ['There was an error'];
    let showResend = false;

    if (!error) {
        return null;
    }
    if (typeof error === 'string') {
        msgs = [error];
    }

    const { graphQLErrors } = error;

    if (graphQLErrors?.length) {
        msgs = [];
        graphQLErrors.forEach((e) => {
            msgs.push(e.message);
            if (onFoundCode) {
                onFoundCode(e.extensions.code);
            }
            if (e.extensions.code === 'EMAIL_NOT_VERIFIED') {
                showResend = true;
            }
            if (e.message === 'EMAIL_NOT_UNIQUE') {
                msgs = ['Email already in use'];
            }
        });
    }

    return (
        <div className={'errors' + (center ? ' center ' : '')} style={style}>
            {msgs.map((m, idx) => {
                return <p key={idx}>{m}</p>;
            })}
            {showResend && <ResendVerificationEmail email={email} />}
        </div>
    );
};

const ResendVerificationEmail = ({ email }) => {
    const { environment } = useServerContext();

    return (
        <Mutation
            mutation={REQUEST_EMAIL_VERIFICATION}
            variables={{
                email,
                redirectLink: environment.CALLBACK_DOMAIN,
            }}
        >
            {(mutate, { loading, data, error }) => {
                return (
                    <button
                        disabled={loading || data || error}
                        className={'link'}
                        onClick={(e) => {
                            e.preventDefault();
                            mutate();
                        }}
                    >
                        {loading ? 'Sending' : data ? 'Email sent' : 'Resend verification email'}
                    </button>
                );
            }}
        </Mutation>
    );
};

export default ErrorMessageApollo;
