import { ReactElement } from "react";
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, View } from "react-native";

interface Props extends ActivityIndicatorProps {
    withBackground?: boolean;
}

export const LoadingSpinner = ({ withBackground = false, ...props }: Props): ReactElement => {
    const children = <ActivityIndicator {...props} size="large" color="black" />;
    return withBackground ? (
        <View
            style={styles.background}
            className="absolute z-30 h-full w-full items-center justify-center"
        >
            {children}
        </View>
    ) : (
        children
    );
};

const styles = StyleSheet.create({
    background: { backgroundColor: "rgba(0, 0, 0, 0.05)" },
});
