import { ReactElement, useLayoutEffect, useState } from "react";
import { Image, Linking, Pressable, StyleSheet, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { t } from "i18next";

import { CustomInput, CustomText } from "components/UI/CustomElements";
import { useAuth } from "context/auth-context";
import { useChat } from "context/chat-context";
import { RootStackNavigatorParamList, TempChatType } from "schema/navigationTypes";

const renderIcon = (onPress: () => void) => (
    <Ionicons name="send" size={24} color="blue" onPress={onPress} />
);

const headerRightComponent = (phoneNumber: string) => (
    <Pressable
        style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            paddingLeft: 25,
        })}
        accessibilityRole="button"
        onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
    >
        <FontAwesome name="phone" size={28} color="black" />
    </Pressable>
);

export const TempChat = (): ReactElement => {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const { params } = useRoute<TempChatType>();
    const { setOptions } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();
    const { tempChat, createNewMessage } = useChat();

    useLayoutEffect(() => {
        setOptions({
            title: params.user.fullName,
            headerRight: () => headerRightComponent(params.user.phoneNumber || ""),
        });
    }, [params.user.fullName, params.user.phoneNumber, setOptions]);

    const handleSubmit = () => {
        if (!message.trim()) return;
        createNewMessage({ senderId: user?.userId || "", message });
        setMessage("");
    };

    return (
        <View style={styles.rootContainer}>
            <CustomText category="c1" className="text-gray-500" style={styles.hint}>
                {`${t("Welcome! This is a temporary chat. Your permanent chat with")} ${
                    params.user.fullName
                } 
                ${t(
                    "will be created once you send your first message. Thank you for yourunderstanding.🤝",
                )}`}
            </CustomText>
            <View style={styles.messages}>
                <FlashList
                    data={tempChat?.messages}
                    estimatedItemSize={50}
                    refreshing={false}
                    inverted
                    renderItem={({ item, index }) => {
                        return (
                            <View
                                key={`temp-message-${index}`}
                                className="flex w-full items-center justify-end py-2"
                            >
                                <View className="order-2 flex h-full">
                                    {user && user.photoURL ? (
                                        <Image
                                            accessibilityIgnoresInvertColors
                                            source={{ uri: user.photoURL }}
                                            alt="profile"
                                            className="m-2 h-10 w-10 rounded-full"
                                            borderRadius={50}
                                        />
                                    ) : (
                                        <CustomText
                                            className={
                                                "m-2 h-10 w-10 rounded-full bg-gray-700 text-white"
                                            }
                                        >
                                            {user && user.username
                                                ? user.username.firstName[0]
                                                : "U"}
                                        </CustomText>
                                    )}
                                </View>

                                <View className="order-1 max-w-[60%]">
                                    <CustomText className="whitespace-pre-line break-words rounded-lg bg-gray-100 p-3 text-sm">
                                        {item.message}
                                    </CustomText>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
            <CustomInput
                value={message}
                onChangeText={(text) => setMessage(text)}
                placeholder="Message"
                accessoryRight={() => renderIcon(handleSubmit)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
    messages: { flex: 1, padding: 16, paddingBottom: 4 },
    img: { width: 40, height: 40, margin: 8 },
    hint: { textAlign: "center", marginTop: 4, marginHorizontal: 2, fontSize: 14 },
});
