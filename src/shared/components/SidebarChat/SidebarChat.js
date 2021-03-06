import React, { useEffect, useRef, useCallback } from 'react';
import { useQuery } from 'react-apollo';
import { NavLink, useHistory, useLocation, Route } from 'react-router-dom';
import { Avatar, ClosePopupButton, Row, TeritaryButton, Col } from 'components/Blocks';
import { EVENT_GIGS } from 'routes/Event/gql';
import { gigStates } from 'constants/constants';
import Chat from 'components/common/Chat';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes, userRoutes } from 'constants/locales/appRoutes';
import { useAppState } from 'components/hooks/useAppState';
import { BodySmall } from 'components/Text';
import { LazyContactInformationPopup } from 'routes/GetProfessional';
import {
    ShadowWrapper,
    ExtraChatsLayover,
    ChatMessagesWrapper,
    FixedWrapper,
    ChatAvatarWrapper,
    ChatList,
    ChatBox,
    ChatHeader,
    ChatItem,
    NameBlock,
    NameBox,
    NewMessagesIndicator,
} from './blocks';
import ChatConfirmBeforeContact from './ChatConfirmBeforeContact';

const gigToChatConfig = ({ organizer, eventId, notifications }) => (gig) => ({
    ...gig,
    showPersonalInformation: gig.status === gigStates.CONFIRMED || gig.dj?.appMetadata?.isPro,
    chatId: gig.id,
    receiver: {
        id: gig.dj?.id,
        nickName: gig.dj?.artistName,
        name: gig.dj?.userMetadata.firstName,
        image: gig.dj?.picture.path,
        permalink: gig.dj?.permalink,
    },
    sender: {
        id: organizer.id,
        nickName: organizer.artistName,
        name: organizer.userMetadata.firstName,
        image: organizer.picture.path,
    },
    hasMessage: notifications[gig.id] && notifications[gig.id].read < notifications[gig.id].total,
    eventId,
});

const SidebarChat = () => {
    const { notifications, activeChat, activeEvent, setAppState } = useAppState();
    const initialized = useRef(false);

    const setActiveChat = useCallback((chat) => setAppState({ activeChat: chat }), [setAppState]);

    const { data } = useQuery(EVENT_GIGS, {
        skip: !activeEvent?.id,
        variables: {
            id: activeEvent?.id,
            hash: activeEvent?.hash,
        },
    });

    const chats = data?.event?.gigs
        .filter((g) => !!g.lastChatMessage || notifications[g.id] || activeChat === g.id)
        .map(
            gigToChatConfig({
                notifications,
                organizer: activeEvent.organizer,
                eventId: activeEvent?.id,
            })
        );

    // open the latest chat
    useEffect(() => {
        if (!initialized.current && chats) {
            const toBeActivated = chats.reduce(
                (latestChat, chat) => {
                    if (
                        chat.lastChatMessage &&
                        new Date(latestChat.lastChatMessage.date) <
                            new Date(chat.lastChatMessage.date)
                    ) {
                        return chat;
                    }
                    return latestChat;
                },
                { lastChatMessage: { date: new Date(0) } }
            );

            if (toBeActivated?.id) {
                setActiveChat(toBeActivated.id);
                initialized.current = true;
            }
        }
    }, [activeChat, setActiveChat, chats]);

    if (!activeEvent || !chats) {
        return null;
    }

    return (
        <InnerContent
            chats={chats}
            event={activeEvent}
            setActiveChat={setActiveChat}
            activeChat={activeChat}
        />
    );
};

const InnerContent = ({ chats = [], event, activeChat, setActiveChat }) => {
    const doesOverflow = chats.length > 7;
    const activeChats = chats.slice(0, doesOverflow ? 6 : 7);
    const remainingChats = chats.slice(6);
    const chat = chats.find((c) => c.id === activeChat);

    return (
        <FixedWrapper>
            {chat && <ChatWrapper chat={chat} event={event} onClose={() => setActiveChat(null)} />}
            <ChatList>
                {activeChats.map((c) => (
                    <ChatBubble
                        active={c.id === activeChat}
                        key={c.id}
                        onClick={() => setActiveChat(c.id)}
                        {...c}
                    />
                ))}

                {doesOverflow && (
                    <ExtraChats
                        setActiveChat={setActiveChat}
                        chats={remainingChats}
                        active={remainingChats.some((c) => c.id === activeChat)}
                    />
                )}
            </ChatList>
        </FixedWrapper>
    );
};

const ExtraChats = ({ chats, active, setActiveChat }) => {
    const hasMessage = chats.some((c) => c.hasMessage);

    return (
        <ChatItem className={active ? 'active' : ''}>
            <ChatAvatarWrapper>
                <ShadowWrapper>
                    <img src={chats[0].receiver.image} />
                    <ExtraChatsLayover>+ {chats.length}</ExtraChatsLayover>
                </ShadowWrapper>
                {hasMessage && <NewMessagesIndicator />}
            </ChatAvatarWrapper>

            <NameBox style={{ top: '100%', transform: 'translate(-100%, -100%)' }}>
                {chats.map((c) => (
                    <TeritaryButton
                        key={c.id}
                        style={{
                            height: '30px',
                            textAlign: 'left',
                        }}
                        onClick={() => setActiveChat(c.id)}
                    >
                        <NameBlock>{c.receiver.nickeName || c.receiver.name}</NameBlock>
                        {c.hasMessage && <NewMessagesIndicator style={{ left: -2, top: 6 }} />}
                    </TeritaryButton>
                ))}
            </NameBox>
        </ChatItem>
    );
};

const ChatBubble = ({ receiver, onClick, active, hasMessage }) => {
    return (
        <ChatItem onClick={onClick} className={active ? 'active' : ''}>
            <ChatAvatarWrapper>
                <ShadowWrapper>
                    <img src={receiver.image} />
                </ShadowWrapper>
                {hasMessage && <NewMessagesIndicator />}
            </ChatAvatarWrapper>

            {!active && (
                <NameBox>
                    <NameBlock>
                        {receiver.nickName || receiver.name}
                        {receiver.nickName && <span>{receiver.name}</span>}
                    </NameBlock>
                </NameBox>
            )}
        </ChatItem>
    );
};

const ChatWrapper = ({ chat, event, onClose }) => {
    const { receiver, chatId } = chat;
    const { translate } = useTranslate();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        return () => {
            document.body.style.overflowY = '';
        };
    }, []);

    const pathname = `${translate(appRoutes.user)}/${receiver.permalink}/${userRoutes.overview}`;

    const handleMessageError = useCallback(
        (error) => {
            if (error.status === 403) {
                // forbidden / trying to send contact info
                const currentPath = location.pathname === '/' ? '' : location.pathname;
                history.push(currentPath + '/chat-confirm-first');
            }
        },
        [history, location]
    );

    return (
        <ChatBox
            onMouseEnter={() => (document.body.style.overflowY = 'hidden')}
            onMouseLeave={() => (document.body.style.overflowY = '')}
        >
            <ChatHeader>
                <NavLink
                    to={{
                        pathname,
                        state: { gigId: chatId },
                        search: `?gigId=${chatId}&eventId=${event.id}&hash=${event.hash}`,
                    }}
                >
                    <TeritaryButton isWrapper title={`See ${receiver.name}'s profile`}>
                        <Row middle>
                            <Avatar
                                small
                                src={receiver.image}
                                style={{ zIndex: 1, marginRight: '8px' }}
                            />
                            <NameBlock>
                                {receiver.nickName || receiver.name}
                                {receiver.nickName && <span>{receiver.name}</span>}
                            </NameBlock>
                        </Row>
                    </TeritaryButton>
                </NavLink>
                <ClosePopupButton small onClick={onClose} />
            </ChatHeader>
            <div style={{ flex: 1 }} />
            <ChatMessagesWrapper>
                <Chat
                    declineOnContactInfo
                    handleMessageError={handleMessageError}
                    key={chat.id}
                    {...chat}
                    placeholder={<EmptyChat receiver={receiver} />}
                />
            </ChatMessagesWrapper>

            <Route
                path="*/chat-confirm-first"
                render={() => <ChatConfirmBeforeContact event={event} gigId={chatId} />}
            />
        </ChatBox>
    );
};

const EmptyChat = ({ receiver }) => {
    return (
        <Col center middle style={{ height: '100%', textAlign: 'center' }}>
            <BodySmall style={{ marginBottom: '0.5em' }}>
                Ask {receiver.name} about anything.
            </BodySmall>
            <BodySmall>Contact information will be visible after booking confirmation.</BodySmall>
        </Col>
    );
};

export default SidebarChat;
