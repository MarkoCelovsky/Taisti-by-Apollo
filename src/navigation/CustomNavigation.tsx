import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { t } from "i18next";

import { Authenticate } from "screens/auth/Authenticate";
import { PasswordReset } from "screens/auth/PasswordReset";
import { Screens } from "screens/screen-names";
import { Chat } from "screens/shared/Chat";
import { ChatDetails } from "screens/shared/ChatDetails";
import { ChatMembers } from "screens/shared/ChatMembers";
import { Conversations } from "screens/shared/Conversations";
import { EditProfile } from "screens/shared/EditProfile";
import { LanguagePreferences } from "screens/shared/LanguagePreferences";
import { NotificationPreferences } from "screens/shared/NotificationPreferences";
import { Notifications } from "screens/shared/Notifications";
import { Profile } from "screens/shared/Profile";
import { TempChat } from "screens/shared/TempChat";
import { Dashboard } from "screens/student/Dashboard";

import { RootStackNavigatorParamList } from "schema/navigationTypes";
import { MyEquations } from "screens/student/MyEquations";
import { NewEquation } from "screens/student/NewEquation";

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
                name={Screens.Conversations}
                component={Conversations}
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
            <Screen name={Screens.Profile} component={Profile} options={{ headerShown: false }} />
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
            <Screen
                name={Screens.MyEquations}
                component={MyEquations}
                options={{ title: t("Equations").toString() }}
            />
            <Screen
                name={Screens.NewEquation}
                component={NewEquation}
                options={{ title: t("New Equation").toString() }}
            />
            <Screen
                name={Screens.Notifications}
                component={Notifications}
                options={{ title: t("Notifications").toString() }}
            />
        </Navigator>
    );
};
