import { ReactElement } from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";
import { Button, ButtonProps, Input, InputProps } from "@ui-kitten/components";
import { EvaSize } from "@ui-kitten/components/devsupport";

interface CutsomInputProps extends InputProps {
    selectionColor?: string;
    size?: EvaSize;
}

interface CutsomButtonProps extends ButtonProps {
    size?: EvaSize;
}

export const CustomInput = ({
    selectionColor = "lightgray",
    size = "large",
    ...props
}: CutsomInputProps): ReactElement => {
    return <Input {...props} selectionColor={selectionColor} size={size} />;
};

export const CustomButton = ({ size = "large", ...props }: CutsomButtonProps): ReactElement => {
    return <Button {...props} size={size} style={[styles.button, props.style]} />;
};

interface CustomTextProps extends TextProps {
    category?: TextCategories;
}

export const CustomText = ({ category, ...props }: CustomTextProps): ReactElement => {
    const style = category ? textStyles[category] : null;
    return <Text {...props} style={[styles.text, style, props.style]} />;
};

export const CustomImage = ({ category, ...props }: CustomTextProps): ReactElement => {
    const style = category ? textStyles[category] : null;
    return <Text {...props} style={[styles.text, style, props.style]} />;
};

const styles = StyleSheet.create({
    button: { borderRadius: 10, fontFamily: "Inter-Regular" },
    text: { fontFamily: "Inter-Regular" },
});

const textStyles: Record<TextCategories, TextStyle> = {
    h1: { fontSize: 36, fontWeight: "800" },
    h2: { fontSize: 32, fontWeight: "800" },
    h3: { fontSize: 30, fontWeight: "800" },
    h4: { fontSize: 26, fontWeight: "800" },
    h5: { fontSize: 22, fontWeight: "800" },
    highlight: { fontSize: 20, fontWeight: "800" },
    h6: { fontSize: 18, fontWeight: "600" },
    c1: { fontSize: 12, fontWeight: "400" },
    c2: { fontSize: 12, fontWeight: "600" },
    s1: { fontSize: 15, fontWeight: "600" },
    s2: { fontSize: 13, fontWeight: "600" },
    label: { fontSize: 12, fontWeight: "800" },
    p1: { fontSize: 15, fontWeight: "400" },
    p2: { fontSize: 13, fontWeight: "400" },
};

type TextCategories =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "highlight"
    | "p1"
    | "p2"
    | "s1"
    | "s2"
    | "c1"
    | "c2"
    | "label";
