import { ReactElement, useLayoutEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { UserListItem } from "components/UI/UserListItem";
import { useChat } from "context/chat-context";
import { Divider } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackNavigatorParamList } from "schema/navigationTypes";
import { AddChatMemberModal } from "components/modals/AddChatMemberModal";
import { useAuth } from "context/auth-context";
import { UserRole } from "schema/types";

const headerRightComponent = (onPress: () => void) => (
    <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
    >
        <Ionicons name="md-add-circle-outline" size={32} />
    </Pressable>
);

export const ChatMembers = (): ReactElement => {
    const { user } = useAuth();
    const { chat, createTempChat, addUserToChat } = useChat();
    const [isShown, setIsShown] = useState(false);
    const { setOptions } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();

    useLayoutEffect(() => {
        user?.userRole !== UserRole.Student &&
            setOptions({
                headerRight: () => headerRightComponent(() => setIsShown(true)),
            });
    }, [setOptions, user?.userRole]);

    if (!chat) return <LoadingSpinner />;

    const addMemberHandler = async (userId: string) => {
        await addUserToChat(chat, userId);
    };
    return (
        <View style={styles.rootContainer}>
            <FlashList
                data={Object.values(chat.users)}
                estimatedItemSize={75}
                ItemSeparatorComponent={Divider}
                renderItem={({ item }) => (
                    <UserListItem
                        photoURL={item.photoURL}
                        title={item.fullName}
                        onPress={() => user?.userRole !== UserRole.Student && createTempChat(item)}
                    />
                )}
            />
            <AddChatMemberModal
                onClose={() => setIsShown(false)}
                isShown={isShown}
                chat={chat}
                onAddMember={(userId: string) => addMemberHandler(userId)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
});
