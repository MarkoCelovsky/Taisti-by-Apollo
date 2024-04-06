import { ReactElement, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Linking, Pressable } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Feather, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    doc as document,
    DocumentSnapshot,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    startAfter,
    Timestamp,
    updateDoc,
} from "firebase/firestore";

import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { useAuth } from "context/auth-context";
import { useChat } from "context/chat-context";
import { Screens } from "screens/screen-names";
import { ChatType, RootStackNavigatorParamList } from "schema/navigationTypes";
import { MessageItem, NotificationTypes, User } from "schema/types";
import { db, messagesCol } from "utils/firebase.config";
import { CustomText } from "components/UI/CustomElements";

export const renderLoadEarlierButton = (handle: () => void) => (
    <Pressable
        style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            paddingHorizontal: 25,
            backgroundColor: "lightgray",
            marginHorizontal: 50,
            marginVertical: 12,
            padding: 8,
            alignItems: "center",
            borderRadius: 12,
        })}
        accessibilityRole="button"
        onPress={handle}
    >
        <CustomText>Load more...</CustomText>
    </Pressable>
);

const headerRightComponent = (phoneNumber: string, isGroup: boolean, navigate?: () => void) => (
    <Pressable
        style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            paddingLeft: 25,
        })}
        accessibilityRole="button"
        onPress={() => (isGroup ? navigate && navigate() : Linking.openURL(`tel:${phoneNumber}`))}
    >
        {isGroup ? (
            <Feather name="info" size={28} color="black" />
        ) : (
            <Entypo name="phone" size={28} color="black" />
        )}
    </Pressable>
);

export const Chat = (): ReactElement => {
    const { params } = useRoute<ChatType>();
    const { userId, user } = useAuth();
    const [oldestMessage, setOldestMessage] = useState<DocumentSnapshot | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isLoadingOlder, setIsLoadingOlder] = useState(false);
    const [locale, setLocale] = useState("sk");
    const { setOptions, navigate } =
        useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();
    const { createMessage, setChat, chat } = useChat();

    useEffect(() => {
        const getLocale = async () => {
            try {
                const l = await AsyncStorage.getItem("lng");
                l && setLocale(l);
            } catch (err) {
                console.error(err);
            }
        };
        getLocale();
    }, []);
    useLayoutEffect(() => {
        const isGroup = !!chat?.chatName;
        setOptions({
            title: params.user ? params.user.fullName : chat?.chatName,
            headerRight: () =>
                headerRightComponent(
                    params.user?.phoneNumber || "",
                    isGroup,
                    isGroup
                        ? () => navigate(Screens.ChatDetails, { chatId: params.chatId })
                        : undefined,
                ),
        });
    }, [chat?.chatName, navigate, params.chatId, params.user, setOptions]);

    const fetchOlder = async () => {
        setIsLoadingOlder(true);
        try {
            const olderMessagesQuery = query(
                messagesCol(params.chatId),
                orderBy("createdAt", "desc"),
                startAfter(oldestMessage),
                limit(5),
            );

            const olderMessagesSnapshot = await getDocs(olderMessagesQuery);

            const olderMessages = olderMessagesSnapshot.docs.map((doc) => {
                const data = doc.data();
                const u = chat?.users[doc.data().senderId];
                return {
                    _id: doc.id,
                    createdAt: new Timestamp(
                        data.createdAt.seconds,
                        data.createdAt.nanoseconds,
                    ).toDate(),
                    text: data.message,
                    received:
                        !!(params.user && data.seenBy.includes(params.user?.userId)) ||
                        !!(chat?.chatName && data.seenBy.length > 1),
                    user: {
                        _id: u?.userId || Math.random().toString(),
                        avatar: u?.photoURL || "",
                        name: u?.fullName || "",
                    },
                };
            });
            setOldestMessage(olderMessagesSnapshot.docs[olderMessagesSnapshot.docs.length - 1]);
            setMessages((curr) => {
                const updatedMessages = [...olderMessages, ...curr];
                updatedMessages.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
                return updatedMessages;
            });
            console.log(messages.length);
            console.log("older", olderMessages.length);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingOlder(false);
        }
    };

    useEffect(() => {
        const getChatUsers = async () => {
            try {
                const userPromises = params.userIds.map((uId) =>
                    getDoc(document(db, `users/${uId}`)),
                );
                const userDocs = await Promise.all(userPromises);
                const fetchedUsers: Record<string, User> = {};

                userDocs.map((userDoc) => {
                    const data = { ...userDoc.data(), userId: userDoc.id } as User;
                    fetchedUsers[data.userId] = data;
                });
                setChat((curr) => curr && { ...curr, users: fetchedUsers });
            } catch (err) {
                console.error(err);
            }
        };
        getChatUsers();
    }, [params.userIds, setChat]);

    useLayoutEffect(() => {
        const q = query(messagesCol(params.chatId), orderBy("createdAt", "desc"), limit(12));

        const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
            try {
                snapshot.docChanges().forEach((change) => {
                    if (
                        (change.type === "added" || change.type === "modified") &&
                        change.doc.data().createdAt
                    ) {
                        const newMessage = {
                            ...change.doc.data(),
                            id: change.doc.id,
                        } as MessageItem;

                        if (!newMessage.seenBy.includes(userId || "ghost")) {
                            newMessage.seenBy = [...newMessage.seenBy, userId || "ghost"];

                            updateDoc(document(messagesCol(params.chatId), newMessage.id), {
                                seenBy: newMessage.seenBy,
                            });
                        }
                    }
                });

                const fetchedMessages = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    const u = chat?.users[doc.data().senderId];
                    return {
                        _id: doc.id,
                        createdAt:
                            new Timestamp(
                                data.createdAt.seconds,
                                data.createdAt.nanoseconds,
                            ).toDate() || data.dayTime,
                        text: data.message,
                        received:
                            !!(params.user && data.seenBy.includes(params.user?.userId)) ||
                            !!(chat?.chatName && data.seenBy.length > 1),
                        user: {
                            _id: u?.userId || Math.random().toString(),
                            avatar: u?.photoURL || "",
                            name: u?.fullName || "",
                        },
                    };
                });
                setMessages(fetchedMessages);
                setOldestMessage(snapshot.docs[snapshot.docs.length - 1]);
            } catch (err) {
                console.log(err);
            }
        });

        return () => unsubscribe();
    }, [chat?.users, params.chatId, chat?.chatName, params.user, setChat, userId]);

    const onSend = useCallback(
        (msgs: IMessage[] = []) => {
            setMessages((curr) => GiftedChat.append(curr, msgs));
            const { text } = msgs[0];
            const isGroup = chat?.chatName;
            const to =
                chat &&
                Object.values(chat?.users)
                    .filter(
                        (u) =>
                            u.userId !== userId &&
                            u.notificationPreferences.includes(NotificationTypes.CHAT_MESSAGE) &&
                            u.deviceToken,
                    )
                    .map((u) => u.deviceToken as string);
            const notiData = isGroup
                ? {
                      message: text,
                      to: to || [],
                      receiverId: [] as string[],
                      title: isGroup,
                  }
                : {
                      message: text,
                      to: to || [],
                      receiverId: [] as string[],
                      title: user?.fullName || "Chat",
                  };
            createMessage(
                params.chatId,
                {
                    message: text,
                    senderId: userId || "",
                    seenBy: userId ? [userId] : [],
                    dayTime: new Date().getTime(),
                },
                notiData,
            );
        },
        [chat, createMessage, user?.fullName, params.chatId, userId],
    );

    if (!chat || !messages.length || !Object.keys(chat.users).length) {
        return <LoadingSpinner />;
    }
    return (
        <GiftedChat
            messages={messages}
            // renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
            onSend={(giftedMessages) => onSend(giftedMessages)}
            user={{ _id: userId || Math.random() }}
            loadEarlier={!!oldestMessage}
            locale={locale}
            bottomOffset={0}
            // bottomOffset={insets.bottom}
            // renderLoadEarlier={() => renderLoadEarlierButton(fetchOlder)}
            onLoadEarlier={fetchOlder}
            renderUsernameOnMessage
            timeFormat="HH:mm"
            // listViewProps={{ onEndReached: fetchOlder, onEndReachedThreshold: 0.5 }}
            isLoadingEarlier={isLoadingOlder}
        />
    );
};

// const CustomInputToolbar: React.FC<InputToolbarProps> = (props) => {
//     return (
//         <InputToolbar
//             {...props}
//             containerStyle={{
//                 ...props.containerStyle,
//                 height: 50,
//                 justifyContent: "center", // specify the height you want
//             }}
//         />
//     );
// };
