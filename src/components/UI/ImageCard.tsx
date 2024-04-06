import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { CustomText } from "./CustomElements";

interface Props {
    backgroundColor?: string;
    firstName: string;
    lastName?: string;
    colorIndex?: number;
}

export const ImageCard = ({
    firstName,
    backgroundColor,
    lastName,
    colorIndex = 11,
}: Props): ReactElement => {
    const randomColor =
        darkColors[colorIndex] || darkColors[Math.floor(Math.random() * darkColors.length)];
    return (
        <View
            style={[
                styles.rootContainer,
                backgroundColor ? { backgroundColor } : { backgroundColor: randomColor },
            ]}
        >
            <CustomText style={styles.text}>
                {firstName} {lastName}
            </CustomText>
        </View>
    );
};

const darkColors = [
    "#FF5733", // Copper
    "#C0C0C0", // Silver
    "#FFC0CB", // Blush Pink
    "#00FF00", // Lime Green
    "#4169E1", // Royal Blue
    "#FF00FF", // Fuchsia
    "#E6E6FA", // Lavender
    "#B0E0E6", // Powder Blue
    "#800000", // Cranberry
    "#D2691E", // Chocolate
    "#000080", // Navy Blue
    "#FF4500", // Orange Red
    "#2E8B57", // Sea Green
    "#ADFF2F", // Green Yellow
    "#8A2BE2", // Blue Violet
    "#A52A2A", // Brown
    "#7FFF00", // Chartreuse
    "#D02090", // Violet Red
    "#FFD700", // Gold
    "#F08080", // Light Coral
];

const styles = StyleSheet.create({
    rootContainer: {
        borderRadius: 100,
        height: 60,
        width: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    text: { color: "white", fontSize: 16, textAlign: "center" },
});
