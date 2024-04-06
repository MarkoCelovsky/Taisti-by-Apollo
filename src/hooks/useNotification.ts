import { addDoc } from "firebase/firestore";
import { Notification } from "schema/types";

import { notificationsCol } from "utils/firebase.config";

interface Props {
    to: string | string[];
    title: string;
    message?: string;
    receiverId: string[];
    groupId?: string;
    dontSave?: boolean;
}

export const useNotification = () => {
    const sendNotification = async ({
        message,
        title,
        to,
        receiverId,
        groupId,
        dontSave = false,
    }: Props) => {
        try {
            console.log("notifing", to);
            await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to,
                    title,
                    body: message,
                    badge: 1,
                }),
            });
            !dontSave &&
                (await addDoc(notificationsCol(groupId || ""), {
                    receiverId,
                    title,
                    message: message || "",
                    createdAt: new Date().getTime(),
                } as Omit<Notification, "docId">));

            console.log("noti was send");
        } catch (err) {
            console.error(err);
        }
    };

    return sendNotification;
};
