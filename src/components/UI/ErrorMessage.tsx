import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { CustomText } from "./CustomElements";

interface Props {
    error: string | null;
}

export const ErrorMessage = ({ error }: Props): ReactElement => {
    return (
        <View>
            <CustomText style={styles.errorMsg}>{error}</CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    errorMsg: {
        // marginHorizontal: 8,
        marginVertical: 4,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        textAlign: "center",
        borderColor: "red",
        backgroundColor: "lightpink",
        color: "red",
    },
});
