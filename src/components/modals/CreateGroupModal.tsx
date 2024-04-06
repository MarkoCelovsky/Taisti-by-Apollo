import { ReactElement, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal } from "@ui-kitten/components";
import { t } from "i18next";

import { stylesMain, stylesShadows } from "styles/main";

import { CustomButton, CustomInput, CustomText } from "../UI/CustomElements";
import { ErrorMessage } from "../UI/ErrorMessage";

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}

export const CreateGroupModal = ({ isVisible, onClose, onCreate }: Props): ReactElement => {
    const [groupName, setGroupName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const createGroupHandler = () => {
        if (groupName.trim().length === 0) {
            return setError(t("Please define the name of the group"));
        }
        onCreate(groupName);
        setError(null);
        setGroupName("");
        onClose();
    };

    const closeModalHandler = () => {
        setError(null);
        setGroupName("");
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            style={[styles.rootContainer, stylesShadows.shadow10]}
            onBackdropPress={closeModalHandler}
            backdropStyle={styles.backdrop}
        >
            <CustomText style={stylesMain.h2}>{t("Create new group")}</CustomText>
            <CustomInput
                label={t("Group name").toString()}
                placeholder={t("January group").toString()}
                style={styles.inputField}
                value={groupName}
                onChangeText={(text) => setGroupName(text)}
            />
            {error ? <ErrorMessage error={error} /> : null}
            <View style={styles.buttons}>
                <CustomButton appearance="outline" status="danger" onPress={closeModalHandler}>
                    {t("Cancel").toString()}
                </CustomButton>
                <CustomButton onPress={createGroupHandler}>{t("Create").toString()}</CustomButton>
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
    inputField: {
        marginVertical: 8,
        paddingTop: 8,
    },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    buttons: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
});
