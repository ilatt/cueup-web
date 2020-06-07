import io from 'socket.io-client';
import { useEffect, useState, useCallback } from 'react';
import { useServerContext } from 'components/hooks/useServerContext';
import { useAppState } from 'components/hooks/useAppState';

export default class NotificationService {
    constructor() {
        this.notificationHandlers = [];
    }

    init = (userId, domain) => {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                this.socket = io(domain + '?userId=' + userId, {});
            }
            if (!userId) {
                return reject('No userId');
            }

            this.socket.on('initialize notifications', (notifications) => {
                resolve(notifications);
            });

            this.socket.on('new notification', (notification) => {
                this.notificationHandlers.reduce((acc, fn) => {
                    return fn(notification);
                }, 0);
            });
        });
    };

    addNotificationHandler = (handler) => {
        this.notificationHandlers.push(handler);
    };

    // Not mutation safe
    removeNotificationHandler = (handler) => {
        const idx = this.notificationHandlers.indexOf(handler);
        this.notificationHandlers.splice(idx, 1);
    };

    reset = () => {
        this.notificationHandlers = [];
    };

    dispose = () => {
        console.log('dispose socket');
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    };

    getChatStatus = () => {
        return new Promise((resolve, reject) => {
            const chatFetcher = () => {
                this.socket.emit('get chat status', (response) => {
                    if (response.error) {
                        return reject(response);
                    }
                    return resolve(response);
                });
            };
            if (this.socket) {
                chatFetcher();
            } else {
                this.onInitializedHandlers.push(chatFetcher);
            }
        });
    };
}

export const useNotifications = ({ userId }) => {
    const { notifications, setAppState } = useAppState();
    const { environment } = useServerContext();

    const setNotifications = useCallback(
        (funOrVal) => {
            setAppState((state) => {
                const notifications =
                    typeof funOrVal === 'function' ? funOrVal(state.notifications) : funOrVal;
                return {
                    ...state,
                    notifications,
                };
            });
        },
        [setAppState]
    );

    useEffect(() => {
        const connect = async () => {
            notificationService.init(userId, environment.CHAT_DOMAIN);
            const nn = await notificationService.getChatStatus();
            setNotifications(nn);
        };
        if (userId) {
            connect();
            return () => {
                notificationService.dispose();
            };
        }
    }, [userId, environment, setNotifications]);

    const readRoom = useCallback(
        (id) => {
            setNotifications((nn) => {
                const existing = nn[id];
                let notifications = nn;
                if (existing) {
                    existing.read = existing.total;
                    notifications = { ...nn, [id]: existing };
                }
                return { notifications };
            });
        },
        [setNotifications]
    );

    // handle the notification
    useEffect(() => {
        const handleNewNotification = (n) => {
            setNotifications((nn) => {
                let existing = nn[n.room];
                if (existing) {
                    existing.total += 1;
                } else {
                    existing = {
                        read: 0,
                        total: 1,
                    };
                }

                return {
                    ...nn,
                    [n.room]: existing,
                };
            });
        };
        notificationService.addNotificationHandler(handleNewNotification);

        return () => {
            notificationService.removeNotificationHandler(handleNewNotification);
        };
    }, [setNotifications]);

    return [notifications, { readRoom }];
};

// Singleton pattern
export const notificationService = new NotificationService();
