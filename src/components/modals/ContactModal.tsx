import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import { t } from "i18next";

import { CustomButton, CustomText } from "../UI/CustomElements";

interface Props {
    name: string;
    phoneNumber: string | null;
    onCall: () => void;
    onMessage: () => void;
    onCancel: () => void;
}

export const ContactModal = ({
    name,
    phoneNumber,
    onCall,
    onMessage,
    onCancel,
}: Props): ReactElement => {
    return (
        <View style={styles.rootContainer}>
            <Text category="h6" className="text-center">{`${t(
                "Are you sure you want to contact",
            )} ${name}?`}</Text>
            <View style={styles.ctr}>
                <CustomButton status="info" onPress={onCall} disabled={!phoneNumber}>
                    <CustomText>{`${t("Call")} ${phoneNumber}`}</CustomText>
                </CustomButton>
                <CustomButton status="info" onPress={onMessage}>
                    {t("Send a message").toString()}
                </CustomButton>
            </View>
            <CustomButton appearance="outline" status="danger" onPress={onCancel}>
                {t("Cancel").toString()}
            </CustomButton>
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1, padding: 16 },
    ctr: { marginVertical: 12, gap: 2 },
});
