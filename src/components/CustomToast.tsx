import { ReactElement } from "react";
import { StyleSheet } from "react-native";
import Toast, { BaseToast, BaseToastProps, ErrorToast } from "react-native-toast-message";

const successToastComponent = (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
        {...props}
        style={styles.successStyle}
        contentContainerStyle={styles.successContent}
        text1Style={styles.text1}
        text2Style={styles.text2}
    />
);
const errorToastComponent = (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast {...props} text1Style={styles.text1} text2Style={styles.text2} />
);

export const CustomToast = (): ReactElement => {
    const toastConfig = {
        success: (props: JSX.IntrinsicAttributes & BaseToastProps) => successToastComponent(props),

        error: (props: JSX.IntrinsicAttributes & BaseToastProps) => errorToastComponent(props),
    };

    return <Toast config={toastConfig} position="bottom" />;
};

const styles = StyleSheet.create({
    text1: { fontSize: 18, fontWeight: "500" },
    text2: { fontSize: 14, fontWeight: "400" },
    successStyle: { borderLeftColor: "green" },
    successContent: { paddingHorizontal: 15 },
});
