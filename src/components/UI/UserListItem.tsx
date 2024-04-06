import { ReactElement } from "react";
import { Image, StyleSheet, TouchableHighlight, View } from "react-native";
import moment from "moment";

import { blankUser } from "context/auth-context";
import { CustomText } from "./CustomElements";

interface Props {
    title: string;
    subtitle?: string;
    onPress: () => void;
    photoURL: string | null;
    timestamp?: number;
    isGroup?: boolean;
    isBold?: boolean;
}
const today = new Date().toDateString();

export const UserListItem = ({
    title,
    subtitle,
    photoURL,
    timestamp,
    onPress,
    isBold = false,
    isGroup = false,
}: Props): ReactElement => {
    const timestampDate = timestamp && new Date(timestamp).toDateString();
    const formatted =
        timestamp && timestampDate === today
            ? moment(new Date(timestamp)).format("H:mm")
            : timestamp && moment(new Date(timestamp)).format("D.M.");
    return (
        <TouchableHighlight
            accessibilityRole="button"
            activeOpacity={0.8}
            underlayColor="white"
            style={styles.listItem}
            onPress={onPress}
        >
            <View style={styles.container}>
                <View style={styles.firstCtr}>
                    <Image
                        source={
                            isGroup
                                ? photoURL
                                    ? { uri: photoURL }
                                    : require("assets/mathify.png")
                                : { uri: photoURL ? photoURL : blankUser }
                        }
                        style={styles.roundImage}
                        accessibilityIgnoresInvertColors
                    />
                    <View style={styles.main}>
                        <CustomText category={isBold ? "highlight" : "h6"}>{title}</CustomText>
                        {subtitle ? (
                            <CustomText
                                category="c1"
                                numberOfLines={1}
                                style={isBold ? styles.isBold : null}
                            >
                                {subtitle}
                            </CustomText>
                        ) : null}
                    </View>
                </View>
                {formatted ? (
                    <View style={styles.side}>
                        <CustomText category="p1" style={isBold ? styles.boldTimestamp : null}>
                            {formatted}
                        </CustomText>
                    </View>
                ) : null}
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    listItem: { height: 70, padding: 12 },
    roundImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    boldTimestamp: { fontWeight: "900" },
    isBold: { fontWeight: "900" },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    firstCtr: {
        flexDirection: "row",
        gap: 12,
        maxWidth: "87%",
        overflow: "hidden",
    },
    side: {
        justifyContent: "center",
        minWidth: "10%",
        alignItems: "center",
    },
    main: { alignItems: "flex-start", justifyContent: "center", overflow: "hidden" },
});
