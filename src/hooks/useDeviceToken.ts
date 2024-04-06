import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowAlert: true,
        };
    },
});

export const useDeviceToken = () => {
    const [deviceToken, setDeviceToken] = useState<string | null>(null);

    useEffect(() => {
        const configurePushNotifications = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            let finalStatus = status;

            if (finalStatus !== "granted") {
                const { status: s } = await Notifications.requestPermissionsAsync();
                finalStatus = s;
            }

            if (finalStatus !== "granted") {
                Alert.alert(
                    "Permission required",
                    "Push notifications need the appropriate permissions.",
                );
                return;
            }

            const { data } = await Notifications.getExpoPushTokenAsync({
                projectId: process.env.EXPO_PROJECT_ID,
            });
            setDeviceToken(data);
            console.log(Platform.OS, { data });

            if (Platform.OS === "android") {
                Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.DEFAULT,
                    sound: "car_horn.wav",
                });
            }
        };

        configurePushNotifications();
    }, []);

    useEffect(() => {
        const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
            console.log("NOTIFICATION RECEIVED");
            console.log(notification);
        });

        const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("NOTIFICATION RESPONSE RECEIVED");
            console.log(response);
        });

        return () => {
            subscription1.remove();
            subscription2.remove();
        };
    }, []);

    return { deviceToken };
};
