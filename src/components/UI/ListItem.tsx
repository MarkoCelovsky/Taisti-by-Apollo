import { ReactElement } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { CustomText } from "./CustomElements";

interface Props {
    onPress: () => void;
    title: string;
}

export const ListItem = ({ onPress, title }: Props): ReactElement => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.listItem} accessibilityRole="button">
            <CustomText className="text-base font-semibold text-white">{title}</CustomText>
            <AntDesign name="right" size={20} color="white" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    listItem: {
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
