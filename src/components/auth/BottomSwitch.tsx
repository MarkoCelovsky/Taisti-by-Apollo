import { ReactElement } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { t } from "i18next";

import { AuthMode } from "schema/types";
import { CustomText } from "components/UI/CustomElements";

interface Props {
    authMode: AuthMode;
    changeMode: (mode: AuthMode) => void;
}

export const BottomSwitch = ({ authMode, changeMode }: Props): ReactElement => {
    return (
        <View style={styles.bottomSwitch}>
            {authMode === "SignIn" ? (
                <TouchableWithoutFeedback
                    accessibilityRole="button"
                    onPress={() => changeMode("SignUp")}
                >
                    <CustomText style={styles.btn}>
                        {`${t("Does not have an account")}`}
                        <CustomText className="font-bold text-blue-500">{t("Sign up")}</CustomText>
                    </CustomText>
                </TouchableWithoutFeedback>
            ) : (
                <TouchableWithoutFeedback
                    accessibilityRole="button"
                    onPress={() => changeMode("SignIn")}
                >
                    <CustomText style={styles.btn}>
                        {`${t("Already have an account")}`}
                        <CustomText className="font-bold text-blue-500">{t("Sign in")}</CustomText>
                    </CustomText>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    bottomSwitch: { marginBottom: 24 },
    btn: { flex: 1, paddingTop: 24, textAlign: "center" },
});
