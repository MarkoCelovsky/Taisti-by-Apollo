import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { t } from "i18next";

import { Authenticate } from "screens/auth/Authenticate";
import { PasswordReset } from "screens/auth/PasswordReset";
import { Screens } from "screens/screen-names";
import { Chat } from "screens/shared/Chat";
import { ChatDetails } from "screens/shared/ChatDetails";
import { ChatMembers } from "screens/shared/ChatMembers";
import { PopularMarket } from "screens/student/PopularMarket";
import { EditProfile } from "screens/shared/EditProfile";
import { LanguagePreferences } from "screens/shared/LanguagePreferences";
import { NotificationPreferences } from "screens/shared/NotificationPreferences";
import { Profile } from "screens/shared/Profile";
import { TempChat } from "screens/shared/TempChat";
import { Dashboard } from "screens/student/Dashboard";
import { Learning } from "screens/student/Learning";
import { RootStackNavigatorParamList } from "schema/navigationTypes";
import { FirstStepSetup } from "screens/auth/FirstStepSetup";
import { SecondStepSetup } from "screens/auth/SecondStepSetup";
import { ThirdStepSetup } from "screens/auth/ThirdStepSetup";
import { FourthStepSetup } from "screens/auth/FourthStepSetup";
import { Community } from "screens/student/Community";
import { Taisti } from "screens/student/AI";

const { Navigator, Screen } = createNativeStackNavigator<RootStackNavigatorParamList>();

export const NestedAuthScreens = () => {
    return (
        <Navigator
            initialRouteName={Screens.Authenticate}
            screenOptions={{
                headerBackTitleVisible: false,
                animation: "slide_from_right",
                gestureEnabled: true,
                headerShadowVisible: false,
                headerTitleAlign: "center",
            }}
        >
            <Screen
                name={Screens.Authenticate}
                component={Authenticate}
                options={{ headerShown: false }}
            />
        </Navigator>
    );
};

export const NestedSetupScreens = () => {
    return (
        <Navigator
            initialRouteName={Screens.FirstStepSetup}
            screenOptions={{
                headerBackTitleVisible: false,
                animation: "slide_from_right",
                gestureEnabled: true,
                headerShadowVisible: false,
                headerTitleAlign: "center",
            }}
        >
            <Screen
                name={Screens.FirstStepSetup}
                component={FirstStepSetup}
                options={{ headerShown: false }}
            />
            <Screen
                name={Screens.SecondStepSetup}
                component={SecondStepSetup}
                options={{ headerShown: false }}
            />
            <Screen
                name={Screens.ThirdStepSetup}
                component={ThirdStepSetup}
                options={{ headerShown: false }}
            />
            <Screen
                name={Screens.FourthStepSetup}
                component={FourthStepSetup}
                options={{ headerShown: false }}
            />
            <Screen
                name={Screens.PasswordReset}
                component={PasswordReset}
                options={{ title: t("Reset your password").toString() }}
            />
        </Navigator>
    );
};

export const NestedConversationsScreens = () => {
    return (
        <Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                animation: "slide_from_right",
                gestureEnabled: true,
                headerStyle: { backgroundColor: "white" },
                headerShadowVisible: false,
                headerTitleAlign: "center",
            }}
        >
            <Screen
                name={Screens.PopularMarket}
                component={PopularMarket}
                options={{ headerShown: false }}
            />
            <Screen name={Screens.Chat} component={Chat} />
            <Screen
                name={Screens.ChatMembers}
                component={ChatMembers}
                options={{ headerTitle: t("Members").toString() }}
            />
            <Screen
                name={Screens.ChatDetails}
                component={ChatDetails}
                options={{ headerTitle: "" }}
            />
            <Screen name={Screens.TempChat} component={TempChat} />
        </Navigator>
    );
};

const profile = (
    <>
        <Screen name={Screens.Profile} component={Profile} />
        <Screen
            name={Screens.EditProfile}
            component={EditProfile}
            options={{ title: t("Edit profile").toString() }}
        />

        <Screen
            name={Screens.LanguagePreferences}
            component={LanguagePreferences}
            options={{ title: t("Language preferences").toString() }}
        />
        <Screen
            name={Screens.NotificationPreferences}
            component={NotificationPreferences}
            options={{ title: t("Notification preferences").toString() }}
        />
    </>
);

export const NestedProfileScreens = () => {
    return (
        <Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                animation: "slide_from_right",
                gestureEnabled: true,
                headerShadowVisible: false,
                headerTitleAlign: "center",
            }}
        >
            <Screen name={Screens.Profile} component={Profile} />
            <Screen
                name={Screens.EditProfile}
                component={EditProfile}
                options={{ title: t("Edit profile").toString() }}
            />

            <Screen
                name={Screens.LanguagePreferences}
                component={LanguagePreferences}
                options={{ title: t("Language preferences").toString() }}
            />
            <Screen
                name={Screens.NotificationPreferences}
                component={NotificationPreferences}
                options={{ title: t("Notification preferences").toString() }}
            />

            <Screen name={Screens.Chat} component={Chat} />
            <Screen
                name={Screens.ChatMembers}
                component={ChatMembers}
                options={{ headerTitle: t("Members").toString() }}
            />
            <Screen
                name={Screens.ChatDetails}
                component={ChatDetails}
                options={{ headerTitle: "" }}
            />
            <Screen name={Screens.TempChat} component={TempChat} />
        </Navigator>
    );
};

export const NestedDashboardScreens = () => {
    return (
        <Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                animation: "simple_push",
                gestureEnabled: true,
                gestureDirection: "horizontal",
                headerShadowVisible: false,
                headerTitleAlign: "center",
            }}
        >
            <Screen
                name={Screens.Dashboard}
                component={Dashboard}
                options={{
                    headerShown: false,
                }}
            />
            {profile}
        </Navigator>
    );
};

export const NestedLearningScreens = () => {
    return (
        <Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                animation: "simple_push",
                gestureEnabled: true,
                gestureDirection: "horizontal",
                headerShadowVisible: false,
                headerTitleAlign: "center",
            }}
        >
            <Screen
                name={Screens.Learning}
                component={Learning}
                options={{
                    headerShown: false,
                }}
            />
            {profile}
        </Navigator>
    );
};

export const NestedTaistiScreens = () => {
    return (
        <Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                animation: "simple_push",
                gestureEnabled: true,
                gestureDirection: "horizontal",
                headerShadowVisible: false,
                headerTitleAlign: "center",
            }}
        >
            <Screen
                name="Taisti"
                component={Taisti}
                options={{
                    headerShown: false,
                }}
            />
            {profile}
        </Navigator>
    );
};

export const NestedCommunityScreens = () => {
    return (
        <Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                animation: "simple_push",
                gestureEnabled: true,
                gestureDirection: "horizontal",
                headerShadowVisible: false,
                headerTitleAlign: "center",
            }}
        >
            <Screen
                name={Screens.Community}
                component={Community}
                options={{
                    headerShown: false,
                }}
            />
            {profile}
        </Navigator>
    );
};
