import { ReactElement, useCallback, useMemo, useRef } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { FlashList } from "@shopify/flash-list";
import { Divider } from "@ui-kitten/components";
import { t } from "i18next";

import { CreateConversation } from "components/CreateConversation";
import { CustomButton, CustomText } from "components/UI/CustomElements";
import { Heading } from "components/UI/Heading";
import { UserListItem } from "components/UI/UserListItem";
import { useAuth } from "context/auth-context";
import { useChat } from "context/chat-context";
import { UserRole } from "schema/types";

export const Conversations = (): ReactElement => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { user } = useAuth();
    const { conversations, selectConversation } = useChat();

    const snapPoints = useMemo(() => ["78%", "90%"], []);

    const openModalHandler = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleCloseModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);

    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        ),
        [],
    );

    return (
        <SafeAreaView style={styles.rootContainer}>
            <View style={styles.headingCtr}>
                <Heading>{t("Messages")}</Heading>
                <View style={styles.iconButton}>
                    <MaterialCommunityIcons
                        onPress={openModalHandler}
                        name="chat-plus-outline"
                        size={28}
                        color="black"
                    />
                </View>
            </View>
            {!conversations.length ? (
                <View className="mt-7 flex-1 items-center justify-center gap-2 p-4">
                    <CustomText category="h5">
                        {t("You don't have any conversations yet")}
                    </CustomText>
                    <CustomText category="h6">{t("Try creating some")}</CustomText>
                    <CustomButton onPress={openModalHandler}>
                        {t("Create conversation").toString()}
                    </CustomButton>
                </View>
            ) : (
                <FlashList
                    data={conversations}
                    ItemSeparatorComponent={Divider}
                    ListEmptyComponent={
                        <View>
                            <CustomText category="h6">
                                {t("You don't have any conversations")}
                            </CustomText>
                        </View>
                    }
                    estimatedItemSize={70}
                    renderItem={({ item }) => {
                        const isGroup = item.chatName;
                        const otherUser = item.users.find((u) => u.userId !== user?.userId);
                        const userIds = item.users.map((u) => u.userId);
                        if (!otherUser) return <></>;
                        return (
                            <UserListItem
                                title={
                                    isGroup
                                        ? isGroup
                                        : `${otherUser.username?.firstName} ${otherUser.username?.lastName}`
                                }
                                subtitle={
                                    item.lastMessage.senderId === user?.userId
                                        ? `${t("You")}: ${item.lastMessage.message}`
                                        : item.lastMessage.message
                                }
                                isBold={!item.lastMessage.seenBy.includes(user?.userId || "")}
                                photoURL={
                                    isGroup
                                        ? item.photoURL
                                            ? item.photoURL
                                            : ""
                                        : otherUser.photoURL || ""
                                }
                                isGroup={!!isGroup}
                                timestamp={item.lastMessage.createdAt.seconds * 1000}
                                onPress={() =>
                                    selectConversation(
                                        item.id,
                                        isGroup ? isGroup : otherUser,
                                        userIds,
                                        isGroup ? item.photoURL : undefined,
                                    )
                                }
                            />
                        );
                    }}
                />
            )}
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                enableDynamicSizing
                onDismiss={handleCloseModal}
                backdropComponent={renderBackdrop}
            >
                <CreateConversation
                    handleCloseModal={handleCloseModal}
                    drvingSchoolId={""}
                    userId={user?.userId || ""}
                    userRole={user?.userRole || UserRole.Student}
                />
            </BottomSheetModal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flexGrow: 1 },
    headingCtr: {
        margin: 16,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    iconButton: {
        justifyContent: "center",
        alignItems: "center",
    },
});
