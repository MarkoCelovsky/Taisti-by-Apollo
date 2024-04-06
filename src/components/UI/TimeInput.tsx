import React, { ReactElement } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { t } from "i18next";
import { CustomText } from "./CustomElements";

interface Props {
    value: string;
    onPress?: () => void;
    title?: string;
    style?: StyleProp<ViewStyle>;
}
export const TimeInput = ({
    value,
    onPress,
    title = t("Time").toString(),
    style,
}: Props): ReactElement => {
    return (
        <Pressable accessibilityRole="button" onPress={onPress} style={style}>
            <CustomText style={styles.timeLabel}>{title}</CustomText>
            <View style={styles.timeContainer}>
                {value ? (
                    <CustomText style={styles.timeText}>{value}</CustomText>
                ) : (
                    <CustomText style={styles.timeTextUndefined}>{title}</CustomText>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    timeContainer: {
        minHeight: 40,
        paddingVertical: 7,
        paddingHorizontal: 8,
        borderRadius: 4,
        borderColor: "#E4E9F2",
        backgroundColor: "#F7F9FC",
        justifyContent: "center",
        borderWidth: 1,
    },
    timeText: { fontSize: 15, color: "#222B45", marginHorizontal: 8 },
    timeTextUndefined: { fontSize: 15, color: "#8F9BB3", marginHorizontal: 8 },
    timeLabel: {
        fontSize: 12,
        color: "#8F9BB3",
        fontWeight: "800",
        marginBottom: 4,
    },
});
