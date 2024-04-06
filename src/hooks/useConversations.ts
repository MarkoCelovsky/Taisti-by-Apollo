import { useCallback, useEffect, useState } from "react";
import {
    collection,
    CollectionReference,
    doc,
    getDoc,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    Unsubscribe,
    where,
} from "firebase/firestore";

import { useAuth } from "context/auth-context";
import { Conversation, MessageItem, User } from "schema/types";
import { conversationsCol, usersCol } from "utils/firebase.config";

export interface TransformedConversation extends Omit<Conversation, "messages" | "userIds"> {
    users: User[];
    lastMessage: MessageItem;
    chatName: string | undefined;
    photoURL: string | undefined;
}

export const useConversationsCollection = () => {
    const { userId } = useAuth();
    const [conversations, setConversations] = useState<TransformedConversation[]>([]);

    const getConversation = useCallback(async (chatId: string) => {
        let data: Omit<Conversation, "messages"> | null = null;
        try {
            const docRef = doc(conversationsCol, chatId);
            const docSnap = await getDoc(docRef);
            data = { ...docSnap.data(), id: docSnap.id } as Omit<Conversation, "messages">;
        } catch (err) {
            console.error(err);
        }
        return data;
    }, []);

    useEffect(() => {
        if (!userId) {
            setConversations([]);
            return;
        }

        const userRef = doc(usersCol, userId);

        const q = query(conversationsCol, where("userIds", "array-contains", userRef));

        const unsubscribeFromConversations = onSnapshot(q, (querySnapshot) => {
            const unsubscribeFromMessages: Unsubscribe[] = [];

            querySnapshot.docs.map(async (document) => {
                try {
                    const userIds = document.data().userIds;
                    const userPromises = userIds.map((userReference) => getDoc(userReference));
                    const userDocs = await Promise.all(userPromises);

                    const users = userDocs.map(
                        (userDoc) =>
                            ({
                                ...userDoc.data(),
                                userId: userDoc.id,
                            } as User),
                    );
                    const messagesCol = collection(
                        conversationsCol,
                        document.id,
                        "messages",
                    ) as CollectionReference<MessageItem>;

                    const messagesQuery = query(
                        messagesCol,
                        orderBy("createdAt", "desc"),
                        limit(1),
                    );

                    const unsubscribeFromMessage = onSnapshot(messagesQuery, (messageSnapshot) => {
                        const lastMessage = messageSnapshot.docs[0]?.data();

                        if (lastMessage && lastMessage.createdAt) {
                            const transformedConversation = {
                                id: document.id,
                                users: users,
                                chatName: document.data().chatName,
                                photoURL: document.data().photoURL,
                                lastMessage: {
                                    ...lastMessage,
                                    createdAt: new Timestamp(
                                        lastMessage.createdAt.seconds,
                                        lastMessage.createdAt.nanoseconds,
                                    ),
                                },
                            } as unknown as TransformedConversation;
                            console.log();
                            setConversations((prev) => {
                                const includes = transformedConversation.users
                                    .map((user) => user.userId)
                                    .includes(userId);

                                if (!includes) {
                                    return [
                                        ...prev.filter(
                                            (conversation) =>
                                                conversation.id !== document.id &&
                                                conversation.users
                                                    .map((user) => user.userId)
                                                    .includes(userId),
                                        ),
                                    ];
                                }
                                return [
                                    ...prev.filter(
                                        (conversation) => conversation.id !== document.id,
                                    ),
                                    transformedConversation,
                                ].sort(
                                    (a, b) =>
                                        (b.lastMessage.createdAt as Timestamp).toDate().getTime() -
                                        (a.lastMessage.createdAt as Timestamp).toDate().getTime(),
                                );
                            });
                        }
                    });
                    unsubscribeFromMessages.push(unsubscribeFromMessage);
                } catch (err) {
                    console.error(err);
                }
            });

            return () => {
                unsubscribeFromMessages.forEach((unsubscribe) => unsubscribe());
            };
        });

        return () => unsubscribeFromConversations();
    }, [userId]);

    // useEffect(() => {
    //     const saveConversationsSnapshot = () => {
    //         conversations.length &&
    //             mmkvStorage.set(StorageKeys.Conversations, JSON.stringify(conversations));
    //     };
    //     saveConversationsSnapshot();
    // }, [conversations]);

    return {
        conversations,
        getConversation,
    };
};
