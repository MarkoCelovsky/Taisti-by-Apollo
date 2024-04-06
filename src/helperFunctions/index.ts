import * as Notifications from "expo-notifications";
import { t } from "i18next";
import moment from "moment";

import { NotificationTypes, TimeRange } from "schema/types";

export const userImage = (first: string, second?: string) => {
    const randomColor = darkColors[Math.floor(Math.random() * darkColors.length)];
    const url = `https://placehold.co/100/${randomColor}/blue?text=${first + second}&font=roboto`;
    return url;
};

const darkColors = [
    "FF5733", // Copper
    "C0C0C0", // Silver
    "FFC0CB", // Blush Pink
    "00FF00", // Lime Green
    "4169E1", // Royal Blue
    "FF00FF", // Fuchsia
    "E6E6FA", // Lavender
    "B0E0E6", // Powder Blue
    "800000", // Cranberry
    "D2691E", // Chocolate
    "000080", // Navy Blue
    "FF4500", // Orange Red
    "2E8B57", // Sea Green
    "ADFF2F", // Green Yellow
    "8A2BE2", // Blue Violet
    "A52A2A", // Brown
    "7FFF00", // Chartreuse
    "D02090", // Violet Red
    "FFD700", // Gold
    "F08080", // Light Coral
];

export const getDayTime = (date: Date, time: string): number => {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        +time.split(":")[0],
        +time.split(":")[1],
    ).getTime();
};

export const switchTimesIfNeeded = (
    fromTime: string | undefined,
    toTime: string | undefined,
): TimeRange => {
    if (!fromTime) {
        return { fromTime: "", toTime: toTime ? toTime : "" };
    }
    if (!toTime) {
        return { fromTime, toTime: "" };
    }
    if (moment(toTime, "HH:mm").isBefore(moment(fromTime, "HH:mm"))) {
        return {
            fromTime: toTime,
            toTime: fromTime,
        };
    } else {
        return {
            fromTime,
            toTime,
        };
    }
};

export const dashboardGreeting = (): string => {
    const date = new Date();
    if (date.getHours() < 10) {
        //morning
        return t("DashboardMorning");
    } else if (date.getHours() >= 10 && date.getHours() < 17) {
        //noon
        return t("DashboardNoon");
    } else {
        //evening
        return t("DashboardEvening");
    }
};

export const notiPreferencesTranslator = (name: NotificationTypes): string => {
    switch (name) {
        case NotificationTypes.REMINDER:
            return t("Reminder before ride / lesson");
        case NotificationTypes.DAILY_PRACTICE:
            return t("Daily practice");
        case NotificationTypes.LAST_MINUTE_EVENT:
            return t("Last minute ride available");
        case NotificationTypes.CANCELED_EVENT:
            return t("Canceled ride / lesson");
        case NotificationTypes.CHAT_MESSAGE:
            return t("Chat message notification");
        case NotificationTypes.NEW_APPLICATION:
            return t("New application notification");
    }
};

interface GetDistanceProps {
    lat1: number;
    lng1: number;
    lat2: number;
    lng2: number;
}

export const getDistance = ({ lat1, lng1, lat2, lng2 }: GetDistanceProps) => {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lng1 - lng2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    return dist;
};

export const arraysAreEqual = (arr1: Array<NotificationTypes>, arr2: Array<NotificationTypes>) => {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
};

type hoursBefore = "1" | "12" | "24";

export const scheduleLocalNotification = async (dayTime: number, hoursBefore: hoursBefore[]) => {
    let content: Notifications.NotificationContentInput;
    let trigger = 0;
    for (const hour of hoursBefore) {
        const title = t("Next ride soon");
        const start = t("Your next ride starts in");
        switch (hour) {
            case "1":
                content = {
                    title,
                    body: `${start} 1h ${moment(new Date(dayTime)).format(`D/M ${t("at")} HH:mm`)}`,
                };
                trigger = 3600000;
                break;
            case "12":
                content = {
                    title,
                    body: `${start} 12h ${moment(new Date(dayTime)).format(
                        `D/M ${t("at")} HH:mm`,
                    )}`,
                };
                trigger = 43200000;
                break;
            case "24":
                content = {
                    title,
                    body: `${start} 24h ${moment(new Date(dayTime)).format(
                        `D/M ${t("at")} HH:mm`,
                    )}`,
                };
                trigger = 86400000;
                break;
        }
        await Notifications.scheduleNotificationAsync({
            content,
            trigger: { date: dayTime - trigger },
        });
    }
};
