import { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { z, ZodType } from "zod";

import { CustomToast } from "components/CustomToast";
import { CustomButton, CustomInput } from "components/UI/CustomElements";
import { useAuth } from "context/auth-context";
import { stylesAuthForms } from "styles/main";
import { PasswordResetFormData } from "schema/form-types";

const schema: ZodType<PasswordResetFormData> = z.object({
    email: z.string().trim().email("This is not a valid email."),
});

export const PasswordReset = (): ReactElement => {
    const { sendPasswordResetEmail } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordResetFormData>({
        resolver: zodResolver(schema),
    });

    const passwordResetHandler = async ({ email }: PasswordResetFormData) => {
        try {
            await sendPasswordResetEmail(email);
            Toast.show({
                text1: t("Email was send").toString(),
                text2: t("Reset password email was send!").toString(),
            });
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <View style={styles.rootContainer}>
            <View style={stylesAuthForms.formCtr}>
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
                <CustomButton onPress={handleSubmit(passwordResetHandler)} style={styles.btn}>
                    {t("Send Email").toString()}
                </CustomButton>
            </View>
            <CustomToast />
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
    btn: { marginTop: 8 },
});
