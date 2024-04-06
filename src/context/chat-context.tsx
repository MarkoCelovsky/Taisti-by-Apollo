import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";

import { TransformedConversation, useConversationsCollection } from "hooks/useConversations";
import { useNotification } from "hooks/useNotification";
import { Screens } from "screens/screen-names";
import { RootStackNavigatorParamList } from "schema/navigationTypes";
import { Chat, MessageItem, NotiData, User } from "schema/types";
import { conversationsCol, usersCol } from "utils/firebase.config";

import { useAuth } from "./auth-context";
import { t } from "i18next";

interface TempChat {
    receiverUser: User;
    messages: Pick<MessageItem, "message" | "senderId">[];
    initMessageSent: boolean;
}

interface ChatContextProps {
    conversations: TransformedConversation[];
    chat: Chat | null;
    setChat: Dispatch<SetStateAction<Chat | null>>;
    tempChat: TempChat | null;
    selectConversation: (
        id: string,
        user: User | string,
        userIds: string[],
        photoURL?: string,
    ) => void;
    createMessage: (
        convId: string,
        data: Omit<MessageItem, "id" | "createdAt">,
        notiData: NotiData,
    ) => void;
    createGroupConversation: (userIds: string[], groupName: string) => void;
    createNewMessage: (message: Pick<MessageItem, "message" | "senderId">) => void;
    createTempChat: (userData: User) => void;
    addUserToChat: (chat: Chat, userId: string) => void;
}

export const ChatContext = createContext<ChatContextProps>({
    conversations: [],
    chat: null,
    tempChat: null,
    setChat: () => {
        console.log(null);
    },

    selectConversation: (_id: string) => {
        console.log(_id);
    },
    createMessage: (
        _convId: string,
        _data: Omit<MessageItem, "id" | "createdAt">,
        _notiData: NotiData,
    ) => {
        console.log(_convId, _data, _notiData);
    },
    createGroupConversation: (_userIds: string[]) => {
        console.log(_userIds);
    },
    createTempChat: (_userData: User) => {
        console.log(_userData);
    },

    createNewMessage: (_message: Pick<MessageItem, "message" | "senderId">) => {
        console.log(_message);
    },
    addUserToChat: (_chat: Chat, _userId: string) => {
        console.log(_chat, _userId);
    },
});

export const useChat = () => useContext(ChatContext);

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const { user } = useAuth();
    const { navigate, reset } =
        useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();
    const notify = useNotification();
    const { conversations } = useConversationsCollection();
    const [chat, setChat] = useState<Chat | null>(null);
    const [tempChat, setTempChat] = useState<TempChat | null>(null);

    const handleSelectConversation = (
        id: string,
        userData: User | string,
        userIds: string[],
        photoURL?: string,
    ) => {
        const userIsGroup = typeof userData === "string";
        setChat({
            id,
            users: {},
            chatName: userIsGroup ? userData : undefined,
            photoURL,
        });
        navigate(Screens.Chat, {
            chatId: id,
            user: userIsGroup ? null : userData,
            userIds,
        });
    };

    const handleMessagePost = async (
        convId: string,
        data: Omit<MessageItem, "id" | "createdAt">,
        notiData: NotiData,
    ) => {
        try {
            const convRef = doc(conversationsCol, convId);
            const messagesCol = collection(convRef, "messages");

            const messageData = {
                ...data,
                createdAt: serverTimestamp(),
            };

            await addDoc(messagesCol, messageData);
            await notify({ ...notiData, dontSave: true });
        } catch (err) {
            console.error(err);
        }
    };

    const findExistingChat = async (userId: string, userIds: string[] | null) => {
        try {
            const combinedUserIds = [userId, user?.userId || ""].sort();
            const combined = `${combinedUserIds[0]}-${combinedUserIds[1]}`;
            let combinedGroupUserIds: string | null = null;
            if (userIds) {
                combinedGroupUserIds = userIds
                    .sort()
                    .map((uId, idx) =>
                        idx === userIds.indexOf(userIds[userIds.length - 1]) ? uId : uId + "-",
                    )
                    .join("");
            }

            const q = query(
                conversationsCol,
                where(
                    "combinedUserIds",
                    "==",
                    combinedGroupUserIds ? combinedGroupUserIds : combined,
                ),
            );

            const conversationSnapshot = await getDocs(q);
            if (!conversationSnapshot.empty) {
                // return the id of the first found conversation
                return {
                    id: conversationSnapshot.docs[0].id,
                    ...conversationSnapshot.docs[0].data(),
                };
            } else {
                return null;
            }
        } catch (err) {
            console.error("Error fetching conversations: ", err);
            return null;
        }
    };

    const createTempConversation = async (receiverUser: User) => {
        try {
            const chatExists = await findExistingChat(receiverUser.userId, null);
            if (!chatExists) {
                setTempChat({
                    receiverUser: receiverUser,
                    messages: [],
                    initMessageSent: false,
                });
                navigate(Screens.TempChat, { user: receiverUser });
                return;
            }
            setChat({
                id: chatExists.id,
                users: {},
                chatName: chatExists.chatName,
                photoURL: chatExists.photoURL,
            });
            navigate(Screens.Chat, {
                chatId: chatExists.id,
                user: receiverUser,
                userIds: chatExists.userIds.map((ref) => ref.id),
            });
        } catch (err) {
            console.error("Error creating conversation: ", err);
        }
    };

    const createGroupConversation = async (userIds: string[], groupName: string) => {
        try {
            const combinedUserIds = userIds
                .sort()
                .map((uId, idx) =>
                    idx === userIds.indexOf(userIds[userIds.length - 1]) ? uId : uId + "-",
                )
                .join("");

            const chatExists = await findExistingChat("", userIds);

            if (chatExists) {
                setChat({
                    id: chatExists.id,
                    users: {},
                    chatName: groupName,
                    photoURL: chatExists.photoURL,
                });
                navigate(Screens.Chat, {
                    chatId: chatExists.id,
                    user: null,
                    userIds,
                });
            } else {
                const conversationRef = await addDoc(conversationsCol, {
                    userIds: userIds.map((userId) => doc(usersCol, userId)),
                    createdAt: serverTimestamp(),
                    combinedUserIds,
                    chatName: groupName,
                });
                await addDoc(collection(conversationRef, "messages"), {
                    message: t("Welcome").toString(),
                    createdAt: serverTimestamp(),
                    senderId: user?.userId || "",
                    seenBy: [user?.userId || ""],
                    dayTime: new Date().getTime(),
                });
                setChat({
                    id: conversationRef.id,
                    users: {},
                    chatName: groupName,
                });
                navigate(Screens.Chat, {
                    chatId: conversationRef.id,
                    user: null,
                    userIds,
                });
            }
        } catch (err) {
            console.error("Error creating conversation: ", err);
        }
    };

    const addUserToChat = async (groupChat: Chat, userId: string): Promise<void> => {
        try {
            console.log(groupChat, userId);
        } catch (err) {
            console.error(err);
        }
    };

    const createNewMessage = async (initialMessage: Pick<MessageItem, "message" | "senderId">) => {
        if (!tempChat?.initMessageSent) {
            const combinedUserIds = [
                initialMessage.senderId,
                tempChat?.receiverUser.userId || "",
            ].sort();
            try {
                // Create a new conversation with provided user IDs
                const conversationRef = await addDoc(conversationsCol, {
                    userIds: [initialMessage.senderId, tempChat?.receiverUser.userId].map(
                        (userId) => doc(usersCol, userId),
                    ),
                    createdAt: serverTimestamp(),
                    combinedUserIds: `${combinedUserIds[0]}-${combinedUserIds[1]}`,
                });

                // Add initial message to the new conversation
                await addDoc(collection(conversationRef, "messages"), {
                    message: initialMessage.message,
                    createdAt: serverTimestamp(),
                    senderId: initialMessage.senderId,
                    seenBy: [initialMessage.senderId],
                    dayTime: new Date().getTime(),
                });
                reset({
                    index: 1,
                    routes: [
                        { name: Screens.Conversations },
                        {
                            name: Screens.Chat,
                            params: {
                                userIds: combinedUserIds,
                                chatId: conversationRef.id,
                                user: tempChat?.receiverUser || null,
                            },
                        },
                    ],
                });
                setTempChat(null);
            } catch (error) {
                console.error("Error creating new conversation: ", error);
            }
        }

        setTempChat((prev) =>
            prev !== null
                ? {
                      receiverUser: prev.receiverUser,
                      messages: [...prev.messages, initialMessage],
                      initMessageSent: true,
                  }
                : null,
        );
    };

    return (
        <ChatContext.Provider
            value={{
                conversations: conversations ? conversations : [],
                chat,
                setChat,
                selectConversation: handleSelectConversation,
                createMessage: handleMessagePost,
                createNewMessage: createNewMessage,
                createTempChat: createTempConversation,
                createGroupConversation,
                tempChat: tempChat,
                addUserToChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
