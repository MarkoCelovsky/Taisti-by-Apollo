import { Image } from "expo-image";
import { ReactElement } from "react";
import { StyleSheet } from "react-native";

export const EmptyList = (): ReactElement => {
    return (
        <Image
            accessibilityIgnoresInvertColors
            source={require("assets/empty-list.jpg")}
            style={styles.image}
        />
    );
};

const styles = StyleSheet.create({
    image: { width: "100%", height: 300 },
});
