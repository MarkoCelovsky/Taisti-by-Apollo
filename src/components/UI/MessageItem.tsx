import { ReactElement } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

import { Message } from "schema/types";
import { CustomText } from "./CustomElements";

interface Props {
    message: Message;
    onPress: () => void;
    onLongPress?: () => void;
}

export const MessageItem = ({ message, onPress, onLongPress }: Props): ReactElement => {
    return (
        <TouchableHighlight
            accessibilityRole="button"
            activeOpacity={0.8}
            underlayColor="white"
            style={[styles.rootContainer, message.rideId ? styles.flash : null]}
            onLongPress={onLongPress}
            onPress={onPress}
        >
            <View style={styles.container}>
                <View style={styles.main}>
                    <CustomText category={message.rideId ? "highlight" : "h6"}>
                        {message.title}
                    </CustomText>
                    <CustomText category="c1" style={styles.message}>
                        {message.message}
                    </CustomText>
                </View>
                <View style={styles.side}>
                    {message.rideId ? (
                        <AntDesign name="staro" size={28} color="black" onPress={onPress} />
                    ) : (
                        <CustomText category="p1">
                            {moment(new Date(message.createdAt)).format("D MMM")}
                        </CustomText>
                    )}
                </View>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 16,
        overflow: "hidden",
    },
    flash: { backgroundColor: "#FFFACD" },
    main: {
        alignItems: "flex-start",
        justifyContent: "center",
        flex: 1,
        paddingRight: 6,
    },
    container: { flexDirection: "row", justifyContent: "space-between" },
    message: { flexShrink: 1 },
    side: { justifyContent: "center" },
});
