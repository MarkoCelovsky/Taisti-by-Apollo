import { CustomButton, CustomText } from "components/UI/CustomElements";
import { useAuth } from "context/auth-context";
import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Setup = (): ReactElement => {
    const { editUser } = useAuth();

    const finish = async () => {
        await editUser({ accountFinished: true });
    };

    return (
        <SafeAreaView style={styles.rootContainer}>
            <View className="flex-1 bg-red-100">
                <CustomText>Setup</CustomText>
            </View>
            <CustomButton onPress={finish}>Finish</CustomButton>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    rootContainer: { padding: 16, flexGrow: 1 },
});
