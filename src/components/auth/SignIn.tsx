import { ReactElement } from "react";
import { View } from "react-native";
import { t } from "i18next";

import { CustomButton } from "components/UI/CustomElements";
import { stylesAuthForms } from "styles/main";

interface Props {
    signInHandler: () => void;
}

export const SignIn = ({ signInHandler }: Props): ReactElement => {
    return (
        <View>
            <View style={stylesAuthForms.btn}>
                <CustomButton onPress={signInHandler} status="info">
                    {t("Sign in").toString()}
                </CustomButton>
            </View>
        </View>
    );
};
