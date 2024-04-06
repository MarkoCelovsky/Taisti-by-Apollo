import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { t } from "i18next";

import { useChat } from "context/chat-context";
import { useAdmin } from "hooks/useAdmin";
import { User, UserRole } from "schema/types";

import { CustomInput, CustomText } from "./UI/CustomElements";
import { LoadingSpinner } from "./UI/LoadingSpinner";
import { UserListItem } from "./UI/UserListItem";

interface Props {
    handleCloseModal: () => void;
    drvingSchoolId: string;
    userId: string;
    userRole: UserRole;
}

export const CreateConversation = ({
    handleCloseModal,
    drvingSchoolId,
    userId,
    userRole,
}: Props): ReactElement => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const { createTempChat } = useChat();
    const { getAdmins, getDsUsers } = useAdmin(drvingSchoolId);

    const getFreshUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            if (userRole === UserRole.Student) {
                const fetchedUsers = await getAdmins();
                setAllUsers(fetchedUsers);
                return;
            }
            const fetchedUsers = await getDsUsers();
            setAllUsers(fetchedUsers.filter((user) => user.userId !== userId));
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [getAdmins, getDsUsers, userId, userRole]);

    const getUsers = useCallback(() => {
        setIsLoading(true);
        try {
            getFreshUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [getFreshUsers]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const onSelectUser = (user: User) => {
        createTempChat(user);
        handleCloseModal();
    };

    const accessoryRightComponent = () => (
        <Ionicons name="close" size={24} color="lightgray" onPress={() => setSearchQuery("")} />
    );
    const accessoryLeftComponent = () => <Ionicons name="search" size={24} color="lightgray" />;

    const filteredUsers = useMemo(
        () =>
            allUsers.filter(
                (user) =>
                    user.username.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.username.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [allUsers, searchQuery],
    );

    const header = (
        <View style={styles.container}>
            <View className="flex-row justify-between">
                <CustomText category="h3">{t("Create new chat").toString()}</CustomText>
                <FontAwesome name="refresh" size={36} color="black" onPress={getFreshUsers} />
            </View>
            <CustomInput
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                placeholder={t("Search").toString()}
                accessoryRight={accessoryRightComponent}
                accessoryLeft={accessoryLeftComponent}
            />
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.rootContainer}>
                {header}
                <LoadingSpinner />
            </View>
        );
    }

    return (
        <BottomSheetFlatList
            data={filteredUsers}
            refreshControl={<RefreshControl refreshing={false} onRefresh={getUsers} />}
            contentContainerStyle={styles.rootContainer}
            ListEmptyComponent={
                isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <View style={styles.emptyList}>
                        <CustomText style={styles.center} category="h4">
                            {t("No users available")}
                        </CustomText>
                        <CustomText
                            style={styles.center}
                            category="p1"
                            className="text-gray-500"
                            onPress={getFreshUsers}
                        >
                            {t("clear search filter")}
                        </CustomText>
                    </View>
                )
            }
            ListHeaderComponent={header}
            renderItem={({ item }) => (
                <UserListItem
                    photoURL={item.photoURL}
                    subtitle={item.email}
                    title={item.fullName}
                    key={item.userId}
                    onPress={() => onSelectUser(item)}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    rootContainer: { minHeight: 400, paddingVertical: 16, gap: 8 },
    container: { gap: 12, paddingHorizontal: 16 },
    center: { textAlign: "center" },
    emptyList: { paddingHorizontal: 8, gap: 12, marginTop: 32 },
});
