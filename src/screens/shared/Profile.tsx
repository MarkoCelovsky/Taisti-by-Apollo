import { ReactElement, useMemo } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { t } from "i18next";

import { Heading } from "components/UI/Heading";
import { ListItem } from "components/UI/ListItem";
import { blankUser, useAuth } from "context/auth-context";
import { ProfileScreens } from "screens/screen-names";
import { ProfileNavigationParamList } from "schema/navigationTypes";
import { UserRole } from "schema/types";
import { CustomText } from "components/UI/CustomElements";
import { LoadingSpinner } from "components/UI/LoadingSpinner";

export const Profile = (): ReactElement => {
    const { navigate } = useNavigation<NativeStackNavigationProp<ProfileNavigationParamList>>();
    const { user, signOut, editUser } = useAuth();
    const discovery = AuthSession.useAutoDiscovery("https://accounts.google.com");

    const signOutHandler = async () => {
        try {
            const lng = await AsyncStorage.getItem("lng");
            await AsyncStorage.clear();
            await editUser({ deviceToken: null });
            await signOut();
            lng && (await AsyncStorage.setItem("lng", lng));
            const accessToken = await SecureStore.getItemAsync("accessToken");
            if (accessToken && discovery) {
                const a = await AuthSession.revokeAsync({ token: accessToken }, discovery);
                console.log("revocation was successful?", a);
                await SecureStore.deleteItemAsync("accessToken");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const data = useMemo(
        () => ({
            student: [
                {
                    text: t("Edit profile"),
                    screen: ProfileScreens.EditProfile,
                },
                {
                    text: t("Language preferences"),
                    screen: ProfileScreens.LanguagePreferences,
                },
                {
                    text: t("Notification preferences"),
                    screen: ProfileScreens.NotificationPreferences,
                },
                {
                    text: t("Log out"),
                    isSignOut: true,
                    screen: ProfileScreens.NotificationPreferences,
                },
            ],
        }),

        [],
    );

    if (!user) {
        return <LoadingSpinner />;
    }

    const renderData = () => {
        switch (user?.userRole) {
            case UserRole.Student:
                return data.student;
            case UserRole.Admin:
                return data.admin;
            default:
                return data.student;
        }
    };
    return (
        <SafeAreaView style={styles.rootContainer}>
            <Heading>{t("Profile")}</Heading>
            <View className="mb-4 items-center justify-center">
                <Image
                    accessibilityIgnoresInvertColors
                    source={{
                        uri: user.photoURL ? user.photoURL : blankUser,
                    }}
                    style={styles.image}
                />
                <CustomText className="mt-2 text-lg font-semibold text-white">{`${user.username.firstName} ${user.username.lastName}`}</CustomText>
                <CustomText className="text-sm font-normal text-white">{user.email}</CustomText>
            </View>
            <FlashList
                data={renderData()}
                estimatedItemSize={50}
                renderItem={({ item }) => (
                    <>
                        {item ? (
                            <ListItem
                                onPress={() =>
                                    item.isSignOut
                                        ? Alert.alert(
                                              t("Log out of your account").toString(),
                                              t("Are you sure you want to do this?").toString(),
                                              [
                                                  {
                                                      text: t("Cancel").toString(),
                                                  },
                                                  {
                                                      isPreferred: true,
                                                      text: t("Log out").toString(),
                                                      onPress: () => signOutHandler(),
                                                  },
                                              ],
                                              { cancelable: true },
                                          )
                                        : navigate(item.screen)
                                }
                                title={item.text}
                            />
                        ) : null}
                    </>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        padding: 16,
        flexGrow: 1,
    },
    image: { width: 120, height: 120, borderRadius: 60 },
});
