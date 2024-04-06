import { ReactElement } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { CustomText } from "./CustomElements";

interface Props {
    id: string;
    title: string;
    isSelected: boolean;
    onPress: (id: string) => void;
}

export const RadioOption = ({ id, title, isSelected, onPress }: Props): ReactElement => {
    return (
        <Pressable
            accessibilityRole="button"
            style={styles.rootContainer}
            onPress={() => onPress(id)}
        >
            <CustomText category="p1">{title}</CustomText>
            <View style={[styles.selectionSquare, isSelected && styles.isSelected]} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
    },
    selectionSquare: {
        backgroundColor: "white",
        borderRadius: 8,
        borderColor: "#D4D6DD",
        borderWidth: 1,
        width: 24,
        height: 24,
    },
    isSelected: {
        backgroundColor: "#0A4680",
        borderColor: "#0A4680",
        borderRadius: 8,
    },
});
