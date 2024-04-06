import { Modal } from "@ui-kitten/components";
import { CustomButton, CustomText } from "components/UI/CustomElements";
import { t } from "i18next";
import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { Chat } from "schema/types";
import { stylesShadows } from "styles/main";

interface Props {
    onClose: () => void;
    isShown: boolean;
    chat: Chat;
    onAddMember: (userId: string) => void;
}

export const AddChatMemberModal = ({
    isShown,
    onClose,
    chat,
    onAddMember,
}: Props): ReactElement => {
    const addMember = () => {
        onAddMember("userId");
    };
    return (
        <Modal
            visible={isShown}
            style={[styles.rootContainer, stylesShadows.shadow10]}
            onBackdropPress={onClose}
            backdropStyle={styles.backdrop}
        >
            <CustomText className="text-center" category="h6">
                {t("Add new member")}
            </CustomText>
            <View style={styles.btns}>
                <CustomButton onPress={onClose} appearance="outline" status="danger">
                    {t("Close").toString()}
                </CustomButton>
                <CustomButton onPress={addMember} status="info">
                    {t("Add").toString()}
                </CustomButton>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 12,
    },

    backdrop: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
    btns: { flexDirection: "row", justifyContent: "flex-end", gap: 8, alignItems: "center" },
});
