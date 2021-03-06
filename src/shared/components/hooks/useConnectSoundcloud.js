import React, { useCallback, useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { USER_SOUNDS } from 'routes/User/routes/Sounds/gql';
import { SmartButton } from '../Blocks';
import { ME } from '../gql';

const CONNECT_SOUNDCLOUD = gql`
    mutation ConnectSoundCloud($code: String, $redirectUrl: String) {
        connectSoundCloud(code: $code, redirectUrl: $redirectUrl)
    }
`;
const DISCONNECT_SOUNDCLOUD = gql`
    mutation DisconnectSoundCloud {
        disconnectSoundCloud
    }
`;

const useConnectSoundCloud = ({ soundCloudConnected, userId }) => {
    const [connected, setConencted] = useState(soundCloudConnected);

    const [connect, { loading, ...rest }] = useMutation(CONNECT_SOUNDCLOUD, {
        refetchQueries: [
            {
                query: USER_SOUNDS,
                variables: {
                    userId,
                },
            },
        ],
        awaitRefetchQueries: true,
        update: (proxy, { data: { connectSoundCloud } }) => {
            const { me } = proxy.readQuery({
                query: ME,
            });

            proxy.writeQuery({
                query: ME,
                data: {
                    me: {
                        ...me,
                        appMetadata: {
                            ...me.appMetadata,
                            soundCloudConnected: true,
                        },
                    },
                },
            });
        },
    });

    const [disconnect, { loading: disconnectLoading }] = useMutation(DISCONNECT_SOUNDCLOUD, {
        update: (proxy, { data: { disconnectSoundCloud } }) => {
            const { me } = proxy.readQuery({
                query: ME,
            });

            proxy.writeQuery({
                query: ME,
                data: {
                    me: {
                        ...me,
                        appMetadata: {
                            ...me.appMetadata,
                            soundCloudConnected: false,
                        },
                    },
                },
            });
        },
    });

    const doConnect = useCallback(
        async (args) => {
            const { variables } = args || {};
            const redirectUrl = window.location.href;
            // redirect to insta auth screen
            if (!variables || !variables.code) {
                const { data } = await connect({
                    variables: { redirectUrl },
                });
                window.open(data.connectSoundCloud);
            }
        },
        [connect]
    );

    useEffect(() => {
        if (!connected) {
            const parsedUrl = new URL(window.location.href);
            const code = parsedUrl.searchParams.get('soundcloudCode');
            if (code) {
                window.history.replaceState({}, document.title, window.location.pathname);
                connect({
                    variables: { code },
                });
                setConencted(true);
            }
        }
    }, [connect, connected]);

    return [doConnect, { loading: loading || disconnectLoading, disconnect, ...rest }];
};

export default useConnectSoundCloud;
