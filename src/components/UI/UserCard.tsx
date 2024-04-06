import { ReactElement } from "react";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { t } from "i18next";

import { User, UserRole } from "schema/types";
import { CustomText } from "./CustomElements";

interface Props {
    user: User;
    onPress: () => void;
    fullSpace?: boolean;
}

const roleTransformer = (role: UserRole) => {
    switch (role) {
        case UserRole.Instructor:
            return t("Instructor");
        case UserRole.Admin:
            return t("Manager");
        case UserRole.Student:
            return t("Student");
        default:
            return "";
    }
};

export const UserCard = ({ user, onPress, fullSpace = false }: Props): ReactElement => {
    return (
        <Pressable
            android_ripple={{ color: "black" }}
            style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginLeft: 16,
                marginRight: fullSpace ? 16 : 0,
                marginTop: fullSpace ? 12 : 0,
                borderRadius: 10,
                overflow: "hidden",
            })}
            accessibilityRole="button"
            onPress={onPress}
        >
            <ImageBackground
                source={{ uri: user.photoURL || "" }}
                accessibilityIgnoresInvertColors
                borderRadius={10}
                style={[styles.image, fullSpace && styles.fullSpace]}
            >
                <View style={styles.background}>
                    <CustomText style={styles.name}>
                        {user.username.firstName} {user.username.lastName}
                    </CustomText>
                    <CustomText style={styles.role}>{roleTransformer(user.userRole)}</CustomText>
                </View>
            </ImageBackground>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "flex-end",
        padding: 10,
    },
    image: { width: 150, height: 165 },
    fullSpace: { width: "100%" },
    name: { fontSize: 18, fontWeight: "600", color: "white" },
    role: { fontSize: 14, fontWeight: "600", color: "#fff" },
});
