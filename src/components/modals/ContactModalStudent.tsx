import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { Modal } from "@ui-kitten/components";
import { t } from "i18next";

import { CustomButton, CustomText } from "components/UI/CustomElements";
import { stylesShadows } from "styles/main";

interface Props {
    modalIsShown: boolean;
    onClose: () => void;
    onCall: () => void;
    onMessage: () => void;
    name: string;
    phoneNumber: string | null;
}

export const ContactModalStudent = ({
    modalIsShown,
    onClose,
    onCall,
    onMessage,
    name,
    phoneNumber,
}: Props): ReactElement => {
    return (
        <Modal
            visible={modalIsShown}
            backdropStyle={styles.backdrop}
            onBackdropPress={onClose}
            style={[styles.modal, stylesShadows.shadow10]}
        >
            <View style={styles.rootContainer}>
                <CustomText category="h6" className="text-center">
                    {t("Are you sure you want to contact") + " " + name + " " + "?"}
                </CustomText>
                <View style={styles.ctr}>
                    <CustomButton status="info" onPress={onCall} disabled={!phoneNumber}>
                        {t("Call") + " " + phoneNumber}
                    </CustomButton>
                    <CustomButton status="info" onPress={onMessage}>
                        {t("Send a message").toString()}
                    </CustomButton>
                </View>
                <CustomButton appearance="outline" status="danger" onPress={onClose}>
                    {t("Close").toString()}
                </CustomButton>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
    modal: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 12,
    },
    rootContainer: { flex: 1 },
    ctr: { marginVertical: 12, gap: 2 },
});
