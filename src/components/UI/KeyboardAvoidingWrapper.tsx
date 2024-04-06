import { ReactElement, ReactNode } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    StyleProp,
    StyleSheet,
    TouchableWithoutFeedback,
    ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const KeyboardAvoidingWrapper = ({ children }: Props): ReactElement => {
    return (
        <KeyboardAvoidingView style={styles.rootContainer}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <TouchableWithoutFeedback accessibilityRole="button" onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export const KeyboardAvoidingWrapperWithoutScroll = ({ children, style }: Props): ReactElement => {
    return (
        <KeyboardAvoidingView style={[styles.rootContainer, style]}>
            <TouchableWithoutFeedback accessibilityRole="button" onPress={Keyboard.dismiss}>
                {children}
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
    scrollView: { flexGrow: 1 },
});
