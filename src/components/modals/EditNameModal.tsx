import { ReactElement, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal } from "@ui-kitten/components";
import { t } from "i18next";

import { stylesShadows } from "styles/main";

import { CustomButton, CustomInput, CustomText } from "../UI/CustomElements";

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onChange: (newName: string) => void;
    groupName: string;
}

export const EditNameModal = ({ isVisible, onChange, onClose, groupName }: Props): ReactElement => {
    const [text, setText] = useState(groupName);
    return (
        <Modal
            visible={isVisible}
            onBackdropPress={onClose}
            style={[styles.modal, stylesShadows.shadow10]}
            backdropStyle={styles.backdrop}
        >
            <CustomText category="h5">{t("Edit group name")}</CustomText>
            <CustomInput
                placeholder={t("Change group name").toString()}
                value={text}
                onChangeText={(txt) => setText(txt)}
                style={styles.input}
            />
            <View style={styles.btns}>
                <CustomButton status="danger" appearance="ghost" onPress={onClose}>
                    {t("Cancel").toString()}
                </CustomButton>
                <CustomButton
                    disabled={!text.trim()}
                    status="info"
                    onPress={() => onChange(text.trim())}
                >
                    {t("Save").toString()}
                </CustomButton>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
    },
    backdrop: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
    input: { marginVertical: 16 },
    btns: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 4,
        alignItems: "center",
    },
});
