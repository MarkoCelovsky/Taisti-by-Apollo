import { ReactElement, useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";

import { CustomInput } from "components/UI/CustomElements";
import { stylesAuthForms } from "styles/main";
import { SignUpFormData } from "schema/form-types";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<SignUpFormData, any>;
    errors: FieldErrors<SignUpFormData>;
}

export const SignUpInputs = ({ control, errors }: Props): ReactElement => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);

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
            <View style={styles.nameContainer}>
                <View style={styles.inputFieldCtr}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomInput
                                placeholder="John"
                                label={t("First name").toString()}
                                onBlur={onBlur}
                                status={errors.firstName ? "danger" : "basic"}
                                caption={errors.firstName && errors.firstName.message}
                                onChangeText={onChange}
                                style={[stylesAuthForms.inputField, styles.inputFieldCtr]}
                                value={value}
                            />
                        )}
                        name="firstName"
                    />
                </View>
                <View style={styles.inputFieldCtr}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomInput
                                placeholder="Doe"
                                label={t("Last name").toString()}
                                onBlur={onBlur}
                                status={errors.lastName ? "danger" : "basic"}
                                caption={errors.lastName && errors.lastName.message}
                                onChangeText={onChange}
                                style={[stylesAuthForms.inputField, styles.inputFieldCtr]}
                                value={value}
                            />
                        )}
                        name="lastName"
                    />
                </View>
            </View>
            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                        label={t("Email").toString()}
                        placeholder="hello@customer.io"
                        autoCapitalize="none"
                        status={errors.email ? "danger" : "basic"}
                        caption={errors.email && errors.email.message}
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
                        status={errors.password ? "danger" : "basic"}
                        caption={errors.password && errors.password.message}
                        style={stylesAuthForms.inputField}
                        secureTextEntry={secureTextEntry}
                        accessoryRight={renderIcon}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="password"
            />
        </>
    );
};

const styles = StyleSheet.create({
    nameContainer: { flexDirection: "row", gap: 12 },
    inputFieldCtr: { flex: 1 },
});
