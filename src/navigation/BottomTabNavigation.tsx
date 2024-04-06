import { ReactElement } from "react";
import { StyleProp, TextStyle } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { t } from "i18next";

import { useAuth } from "context/auth-context";
import { Screens } from "screens/screen-names";

import {
    NestedAuthScreens,
    NestedConversationsScreens,
    NestedDashboardScreens,
    NestedProfileScreens,
} from "./CustomNavigation";

const { Navigator, Screen } = createBottomTabNavigator();

interface IoniconsProps {
    size?: number;
    color: string;
    name: keyof typeof Ionicons.glyphMap;
    style?: StyleProp<TextStyle>;
}

interface FontAwesomeProps {
    size?: number;
    color: string;
    name: string;
}

const tabBarIoniconsComponent = ({ color, name, size, style }: IoniconsProps) => (
    <Ionicons name={name} size={size} color={color} style={style} />
);

const tabBarFontAwesomeComponent = ({ color, name, size }: FontAwesomeProps) => (
    <FontAwesome5 name={name} size={size} color={color} />
);

export const BottomTabNavigation = (): ReactElement => {
    const { user } = useAuth();

    if (!user) {
        return (
            <Navigator screenOptions={{ headerShadowVisible: false, headerTitleAlign: "center" }}>
                <Screen
                    name={Screens.NestedAuthenticate}
                    component={NestedAuthScreens}
                    options={{
                        tabBarStyle: { display: "none" },
                        headerShown: false,
                    }}
                />
            </Navigator>
        );
    }

    return (
        <Navigator
            screenOptions={{
                headerShadowVisible: false,
                headerTitleAlign: "center",
                tabBarActiveTintColor: "#0A4680",
                tabBarInactiveTintColor: "#C0C0C0",
            }}
        >
            <Screen
                name={Screens.NestedDashboard}
                component={NestedDashboardScreens}
                options={{
                    tabBarIcon: ({ color, size }) =>
                        tabBarFontAwesomeComponent({
                            color,
                            size,
                            name: "tasks",
                        }),
                    title: `${t("Dashboard")}`,
                    headerShown: false,
                }}
            />
            <Screen
                name={Screens.NestedConversations}
                component={NestedConversationsScreens}
                options={{
                    tabBarIcon: ({ color, size }) =>
                        tabBarIoniconsComponent({
                            color,
                            size,
                            name: "chatbubble-ellipses-outline",
                        }),
                    headerShown: false,
                    title: `${t("Messages")}`,
                }}
            />
            <Screen
                name={Screens.NestedProfile}
                component={NestedProfileScreens}
                options={{
                    tabBarIcon: ({ color, size }) =>
                        tabBarFontAwesomeComponent({
                            color,
                            size,
                            name: "user-alt",
                        }),
                    title: `${t("Profile")}`,
                    headerShown: false,
                }}
            />
        </Navigator>
    );
};
