import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { Divider, ListItem } from "@ui-kitten/components";
import { FirestoreError } from "firebase/firestore";
import { t } from "i18next";

import { useGroup } from "hooks/useGroup";
import { Screens } from "screens/screen-names";
import { Ionicons } from "@expo/vector-icons";
import { RootStackNavigatorParamList } from "schema/navigationTypes";
import { Group } from "schema/types";

import { CustomButton, CustomInput, CustomText } from "./UI/CustomElements";
import { ErrorMessage } from "./UI/ErrorMessage";
import { LoadingSpinner } from "./UI/LoadingSpinner";
import { CreateGroupModal } from "./modals/CreateGroupModal";
import { ImageCard } from "./UI/ImageCard";

const renderImage = (first: string, index: number) => (
    <ImageCard firstName={first} colorIndex={index} />
);

const GroupsListRoute = (): ReactElement => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [groupsQuery, setGroupsQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [modalIsShown, setModalIsShown] = useState(false);
    const [groups, setGroups] = useState<Group[]>([]);
    const { getAllGroups, createNewGroup } = useGroup();
    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();

    const fetchAllGroups = useCallback(async () => {
        try {
            setIsLoading(true);
            const g = await getAllGroups();
            setGroups(g);
            setError(null);
        } catch (err) {
            err instanceof FirestoreError ? setError(err.message) : setError(err as string);
        } finally {
            setIsLoading(false);
        }
    }, [getAllGroups]);

    useEffect(() => {
        fetchAllGroups();
    }, [fetchAllGroups]);

    const createGroupHandler = async (name: string) => {
        try {
            await createNewGroup(name);
            fetchAllGroups();
        } catch (err) {
            console.error(err);
        }
    };

    const accessoryRightComponent = () => (
        <Ionicons name="close" size={24} color="lightgray" onPress={() => setGroupsQuery("")} />
    );

    const renderIcon = () => <Ionicons name="search" size={24} color="lightgray" />;

    const filteredGroups = useMemo(
        () =>
            groups.filter((group) => group.name.toLowerCase().includes(groupsQuery.toLowerCase())),
        [groups, groupsQuery],
    );

    return (
        <>
            <CreateGroupModal
                isVisible={modalIsShown}
                onClose={() => setModalIsShown(false)}
                onCreate={createGroupHandler}
            />
            <FlashList
                refreshControl={<RefreshControl refreshing={false} onRefresh={fetchAllGroups} />}
                estimatedItemSize={70}
                ListHeaderComponent={
                    <View className="mx-2 mb-2">
                        <CustomInput
                            value={groupsQuery}
                            onChangeText={(text) => setGroupsQuery(text)}
                            placeholder={t("Search").toString()}
                            size="medium"
                            accessoryRight={accessoryRightComponent}
                            accessoryLeft={renderIcon}
                        />
                        {isLoading ? <LoadingSpinner style={styles.loadingSpinner} /> : null}
                        {error ? <ErrorMessage error={error} /> : null}
                    </View>
                }
                ListEmptyComponent={
                    isLoading ? (
                        <></>
                    ) : (
                        <CustomText className="mt-2 text-center">
                            {t("You have no groups...")}
                        </CustomText>
                    )
                }
                ItemSeparatorComponent={Divider}
                contentContainerStyle={styles.list}
                ListFooterComponent={
                    <View className="mt-2 items-end pr-2">
                        <CustomButton
                            appearance="outline"
                            status="info"
                            onPress={() => setModalIsShown(true)}
                        >
                            {t("New Group").toString()}
                        </CustomButton>
                    </View>
                }
                data={filteredGroups}
                renderItem={({ item, index }) => (
                    <ListItem
                        key={item.name}
                        accessoryLeft={() => renderImage(item.name[0], index)}
                        onPress={() =>
                            navigate(Screens.GroupProfile, {
                                groupData: {
                                    id: item.groupId,
                                    name: item.name,
                                },
                            })
                        }
                        title={item.name}
                        style={styles.listItem}
                    />
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({
    list: { paddingTop: 16, backgroundColor: "white" },
    loadingSpinner: { margin: 12 },
    listItem: { height: 70 },
});

export default GroupsListRoute;
