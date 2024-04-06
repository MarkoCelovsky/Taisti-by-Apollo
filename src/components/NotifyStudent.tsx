import { ReactElement, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal } from "@ui-kitten/components";
import { FirestoreError } from "firebase/firestore";
import { t } from "i18next";

import { useNotification } from "hooks/useNotification";
import { useStudent } from "hooks/useStudent";
import { stylesMain, stylesShadows } from "styles/main";
import { ReceiverData } from "schema/types";

import { CustomButton, CustomInput, CustomText } from "./UI/CustomElements";
import { ErrorMessage } from "./UI/ErrorMessage";

interface Props {
    modalIsShown: boolean;
    onClose: () => void;
    student?: { id: string; name: string; token: string };
    notiSend: (hasToken: boolean) => void;
    multi?: boolean;
}

export const NotifyStudent = ({
    modalIsShown,
    onClose,
    student,
    notiSend,
    multi = false,
}: Props): ReactElement => {
    const [notificationMsg, setNotificationMsg] = useState("");
    const [notificationTitle, setNotificationTitle] = useState("");
    const [error, setError] = useState<string | null>(null);
    const notify = useNotification();
    const { getAllStudents } = useStudent();

    const sendMsgHandler = async () => {
        if (notificationMsg.trim().length <= 0 && notificationTitle.trim().length <= 0) {
            setError(t("Please fill one field at least."));
            return;
        }
        try {
            await notify({
                title: notificationTitle,
                message: notificationMsg,
                to: student?.token ? student?.token : "",
                receiverId: [student?.id ? student.id : ""],
            });
        } catch (err) {
            console.error(err);
        }
        setNotificationMsg("");
        setNotificationTitle("");
        notiSend(student?.token ? true : false);
        setError(null);
    };

    const notifyMultipleHandler = async () => {
        if (notificationMsg.trim().length <= 0 && notificationTitle.trim().length <= 0) {
            return setError(t("Please fill one field at least."));
        }
        try {
            const students = await getAllStudents();

            const receivers: ReceiverData = {
                ids: students ? students.map((s) => s.userId) : [],
                tokens: students
                    ? students.filter((s) => s.deviceToken).map((s) => s.deviceToken as string)
                    : [],
            };

            await notify({
                title: notificationTitle,
                message: notificationMsg,
                to: receivers.tokens,
                receiverId: receivers.ids,
            });
            notiSend(receivers.tokens.length !== 0 ? true : false);
        } catch (err) {
            err instanceof FirestoreError && setError(err.message);
            return;
        }
        setNotificationMsg("");
        setNotificationTitle("");
        setError(null);
    };

    const closeModal = () => {
        onClose();
        setError(null);
        setNotificationMsg("");
        setNotificationTitle("");
    };

    return (
        <Modal
            visible={modalIsShown}
            backdropStyle={styles.backdrop}
            onBackdropPress={closeModal}
            style={[styles.modal, stylesShadows.shadow10]}
        >
            <CustomText className="text-center" style={stylesMain.h3}>
                {multi ? t("Message all students") : `${t("Message student")} ${student?.name}`}
            </CustomText>
            <CustomInput
                label={t("Title").toString()}
                placeholder={t("Title").toString()}
                style={styles.inputField}
                value={notificationTitle}
                onChangeText={(text) => setNotificationTitle(text)}
            />
            <CustomInput
                multiline
                label={t("Message").toString()}
                placeholder={t("Message").toString()}
                style={styles.inputField}
                value={notificationMsg}
                onChangeText={(text) => setNotificationMsg(text)}
            />
            {error ? <ErrorMessage error={error} /> : null}
            <View style={styles.btnGroup}>
                <CustomButton
                    status="danger"
                    appearance="outline"
                    onPress={closeModal}
                    style={styles.btn}
                >
                    {t("Cancel").toString()}
                </CustomButton>
                <CustomButton onPress={multi ? notifyMultipleHandler : sendMsgHandler}>
                    {t("Send").toString()}
                </CustomButton>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    inputField: {
        marginVertical: 8,
        paddingTop: 8,
    },
    btnGroup: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    btn: { marginRight: 4 },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 12,
    },
});
