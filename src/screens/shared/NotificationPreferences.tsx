import { ReactElement, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { arraysAreEqual, notiPreferencesTranslator } from "helperFunctions/index";
import { t } from "i18next";

import { CustomToast } from "components/CustomToast";
import { CustomButton, CustomText } from "components/UI/CustomElements";
import { RadioOption } from "components/UI/RadioOption";
import { useAuth } from "context/auth-context";
import { useStudent } from "hooks/useStudent";
import { NotificationTypes, User, UserRole } from "schema/types";

const notificationTypes: Array<NotificationTypes> = [
    NotificationTypes.REMINDER,
    NotificationTypes.CANCELED_EVENT,
    NotificationTypes.LAST_MINUTE_EVENT,
    NotificationTypes.DAILY_PRACTICE,
    NotificationTypes.CHAT_MESSAGE,
];
const adminNotificationTypes = [...notificationTypes, NotificationTypes.NEW_APPLICATION];

export const NotificationPreferences = (): ReactElement => {
    const { user } = useAuth();
    const [selectedNotifications, setSelectedNotifications] = useState(
        user?.notificationPreferences || [],
    );
    const { updateUser } = useStudent();

    const saveChangesHandler = async () => {
        try {
            user &&
                (await updateUser({
                    ...user,
                    notificationPreferences: selectedNotifications,
                } as User));
            Toast.show({
                text1: t("Changes saved").toString(),
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <View style={styles.rootContainer}>
            <View style={styles.container}>
                <CustomText category="h5">{t("Push notifications").toString()}</CustomText>
                <FlatList
                    data={
                        user?.userRole === UserRole.Admin
                            ? adminNotificationTypes
                            : notificationTypes
                    }
                    contentContainerStyle={styles.radioContainer}
                    renderItem={({ item }) => (
                        <RadioOption
                            id={item}
                            key={item}
                            title={notiPreferencesTranslator(item)}
                            isSelected={selectedNotifications.includes(item) || false}
                            onPress={(notiName) =>
                                setSelectedNotifications((curr) => {
                                    const includes = curr.includes(notiName as NotificationTypes);
                                    if (!includes) {
                                        return [...curr, notiName as NotificationTypes];
                                    } else {
                                        return curr.filter(
                                            (noti) => noti !== (notiName as NotificationTypes),
                                        );
                                    }
                                })
                            }
                        />
                    )}
                />
            </View>
            <CustomButton
                disabled={arraysAreEqual(
                    selectedNotifications,
                    user?.notificationPreferences || [],
                )}
                onPress={saveChangesHandler}
            >
                {t("Save changes").toString()}
            </CustomButton>
            <CustomToast />
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1, padding: 16 },
    container: { flex: 1 },
    radioContainer: { gap: 6, marginTop: 12 },
});
