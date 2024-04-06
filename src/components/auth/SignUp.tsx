import { ReactElement } from "react";
import { View } from "react-native";
import { t } from "i18next";

import { CustomButton } from "components/UI/CustomElements";
import { stylesAuthForms } from "styles/main";

interface Props {
    signUpHandler: () => void;
}

export const SignUp = ({ signUpHandler }: Props): ReactElement => {
    return (
        <View style={stylesAuthForms.btn}>
            <CustomButton onPress={signUpHandler} status="info">
                {t("Sign up").toString()}
            </CustomButton>
        </View>
    );
};
