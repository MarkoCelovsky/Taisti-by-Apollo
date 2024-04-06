import { ReactElement, useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { t } from "i18next";

import { CustomButton, CustomInput, CustomText } from "components/UI/CustomElements";
import { Screens } from "screens/screen-names";
import { stylesAuthForms } from "styles/main";
import { SignInFormData } from "schema/form-types";
import { RootStackNavigatorParamList } from "schema/navigationTypes";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<SignInFormData, any>;
    errors: FieldErrors<SignInFormData>;
}

export const SignInInputs = ({ control, errors }: Props): ReactElement => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();

    const renderIcon = () => (
        <TouchableWithoutFeedback
            accessibilityRole="button"
            onPress={() => setSecureTextEntry((curr) => !curr)}
        >
            <Ionicons name={secureTextEntry ? "eye" : "eye-off"} size={24} />
        </TouchableWithoutFeedback>
    );
    return (
        <>
            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                        label={t("Email").toString()}
                        placeholder="hello@customer.io"
                        autoCapitalize="none"
                        caption={errors.email && errors.email.message}
                        status={errors.email ? "danger" : "basic"}
                        style={stylesAuthForms.inputField}
                        keyboardType={"email-address"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="email"
            />
            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                        label={t("Password").toString()}
                        placeholder={t("Your password").toString()}
                        autoCapitalize="none"
                        style={stylesAuthForms.inputField}
                        caption={errors.password && errors.password.message}
                        status={errors.password ? "danger" : "basic"}
                        secureTextEntry={secureTextEntry}
                        accessoryRight={renderIcon}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="password"
            />
            <TouchableWithoutFeedback
                accessibilityRole="button"
                onPress={() => navigate(Screens.PasswordReset)}
            >
                <CustomText style={styles.forgottenPassword}>{t("Forgotten password")}</CustomText>
            </TouchableWithoutFeedback>
        </>
    );
};

const styles = StyleSheet.create({
    forgottenPassword: {
        color: "#0D65F2",
        fontWeight: "600",
        paddingBottom: 16,
        marginBottom: 8,
    },
});
