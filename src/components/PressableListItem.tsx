import { ReactElement, ReactNode } from "react";
import { StyleSheet, TouchableHighlight, ViewStyle } from "react-native";

import { stylesShadows } from "styles/main";

interface Props {
    onPress: () => void;
    onLongPress?: () => void;
    children: ReactNode;
    stylesProp?: ViewStyle;
}

export const PressableListItem = ({
    onPress,
    onLongPress,
    children,
    stylesProp,
}: Props): ReactElement => {
    return (
        <TouchableHighlight
            accessibilityRole="button"
            style={[styles.container, stylesProp && stylesProp, stylesShadows.shadow4]}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.8}
            underlayColor="lightgray"
        >
            {children}
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        // width: "90%",
        marginHorizontal: "5%",
        marginTop: 8,
        padding: 12,
        borderRadius: 8,
        marginBottom: 6,
        backgroundColor: "white",
    },
});
