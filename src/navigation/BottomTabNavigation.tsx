import { ReactElement } from "react";
import { StyleProp, TextStyle, View, StyleSheet } from "react-native";
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
    NestedSetupScreens,
    NestedDashboardScreens2,
    NestedDashboardScreens3,
} from "./CustomNavigation";
import { LinearGradient } from "expo-linear-gradient";

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
const styles = StyleSheet.create({
    lightbulbContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#242728",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: -30,
        alignSelf: "center",
        zIndex: 1,
    },
    lightbulbIcon: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        overflow: "hidden",
    },
    borderCircle: {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderWidth: 2,
        borderColor: "#0094FF",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: "hidden",
    },
    borderMask: {
        position: "absolute",
        width: "100%",
        height: "35%",
        bottom: 0,
        backgroundColor: "#242728", 
    },
});

const tabBarIoniconsComponent = ({ color, name, size, style }: IoniconsProps) => (
    <Ionicons name={name} size={size} color={color} style={style} />
);

const tabBarFontAwesomeComponent = (
    { color, name, size }: FontAwesomeProps,
    isLightbulb?: boolean,
) => {
    if (isLightbulb) {
        return (
            <View style={styles.lightbulbContainer}>
                <View style={styles.lightbulbIcon}>
                    <View style={styles.borderCircle} />
                    <View style={styles.borderMask} />
                    <FontAwesome5 name={name} size={size} color={color} />
                </View>
            </View>
        );
    } else {
        return <FontAwesome5 name={name} size={size} color={color} />;
    }
};
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

    if (!user.accountFinished) {
        return (
            <Navigator screenOptions={{ headerShadowVisible: false, headerTitleAlign: "center" }}>
                <Screen
                    name={Screens.NestedSetup}
                    component={NestedSetupScreens}
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
                tabBarActiveTintColor: "#006DFC",
                tabBarInactiveTintColor: "#fff",
                tabBarStyle: {
                    backgroundColor: "#242728",
                },
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
                            name: "home",
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
                            name: "bar-chart",
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
                        tabBarFontAwesomeComponent(
                            {
                                color,
                                size,
                                name: "lightbulb",
                            },
                            true,
                        ),
                    title: `${t("AI")}`,
                    headerShown: false,
                }}
            />
            <Screen
                name={Screens.NestedDashboard2}
                component={NestedDashboardScreens2}
                options={{
                    tabBarIcon: ({ color, size }) =>
                        tabBarFontAwesomeComponent({
                            color,
                            size,
                            name: "book",
                        }),
                    title: `${t("Learning")}`,
                    headerShown: false,
                }}
            />
            <Screen
                name={Screens.NestedDashboard3}
                component={NestedDashboardScreens3}
                options={{
                    tabBarIcon: ({ color, size }) =>
                        tabBarFontAwesomeComponent({
                            color,
                            size,
                            name: "globe",
                        }),
                    title: `${t("Community")}`,
                    headerShown: false,
                }}
            />
        </Navigator>
    );
};
