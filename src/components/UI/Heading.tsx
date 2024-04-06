import { ReactElement, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { CustomText } from "./CustomElements";

interface Props {
    children: ReactNode;
}

export const Heading = ({ children }: Props): ReactElement => {
    return <CustomText style={styles.heading}>{children}</CustomText>;
};

const styles = StyleSheet.create({
    heading: { fontSize: 32, fontWeight: "700" },
});
