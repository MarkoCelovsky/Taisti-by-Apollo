import { useAuth } from "context/auth-context";
import { ReactElement, useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

export const Learning = (): ReactElement => {
    const { userId, user } = useAuth();
    const [messages, setMessages] = useState<IMessage[]>([
        {
            _id: "ai",
            createdAt: +new Date(),
            user: { _id: "ai", name: "Apollo Partner" },
            text: `There isn't a single "best" investment that's perfect for everyone. It really depends on your financial goals and risk tolerance.

    That said, Bitcoin has been on a downward trend lately. While it's possible the price could rise again in the future,  cryptocurrencies are inherently volatile, so they carry a significant amount of risk.
    
    Would you like me to help you explore some investment options that might be a better fit for your risk profile? We can look at a variety of assets like stocks, ETFs, and bonds.`,
        },
        {
            _id: userId || "user",
            createdAt: +new Date(Date.now() - 2 * 60 * 1000),
            user: { _id: userId || "user", name: user?.fullName },
            text: "What is the best investment nowadays",
        },
    ]);

    const onSend = useCallback((msgs: IMessage[] = []) => {
        setMessages((curr) =>
            GiftedChat.append(curr, [
                {
                    _id: "ai2" + `${Math.random()}`,
                    createdAt: +new Date(),
                    user: { _id: "ai", name: "Apollo Partner" },
                    text: "Always happy to help",
                },
                ...msgs,
            ]),
        );
    }, []);

    return (
        <SafeAreaView style={styles.rootContainer}>
            <GiftedChat
                messages={messages}
                onSend={(giftedMessages) => onSend(giftedMessages)}
                user={{ _id: userId || "user" }}
                bottomOffset={0}
                renderUsernameOnMessage
                timeFormat="HH:mm"
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    rootContainer: { flexGrow: 1 },
});
