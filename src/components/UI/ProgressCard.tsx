import { ReactElement } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";

import { stylesShadows } from "styles/main";
import { CustomText } from "./CustomElements";

interface Props {
    value: number;
    completedAmount: number;
    onPress?: () => void;
    backgroundColor: string;
    activeColor: string;
    text: string;
    title: string;
    style?: StyleProp<ViewStyle>;
    scale?: number;
}

export const ProgressCard = ({
    value,
    completedAmount,
    onPress,
    activeColor,
    backgroundColor,
    text,
    title,
    style,
    scale = 1,
}: Props): ReactElement => {
    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            style={[styles(scale).progressCard, stylesShadows.shadow2, { backgroundColor }, style]}
        >
            <CircularProgress
                value={value}
                valueSuffix="%"
                activeStrokeColor={activeColor}
                radius={40 * scale}
                inActiveStrokeWidth={8 * scale}
                activeStrokeWidth={8 * scale}
            />
            <CustomText style={styles(scale).progressTitle}>{title}</CustomText>
            <CustomText style={styles(scale).progressSubTitle}>
                {completedAmount} {text}
            </CustomText>
        </Pressable>
    );
};

const styles = (scale: number) =>
    StyleSheet.create({
        progressCard: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 6 * scale,
            paddingHorizontal: 10 * scale,
            borderRadius: 8 * scale,
        },
        progressTitle: { marginTop: 4 * scale, fontSize: 18 * scale, fontWeight: "700" },
        progressSubTitle: {
            marginTop: 2 * scale,
            fontSize: 10 * scale,
            fontWeight: "600",
            color: "gray",
        },
    });
