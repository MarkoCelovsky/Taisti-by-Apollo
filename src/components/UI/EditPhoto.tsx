import React, { ReactElement } from "react";
import { Alert, ImageBackground, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { t } from "i18next";

import { blankUser } from "context/auth-context";
import { CustomText } from "./CustomElements";

interface Props {
    image?: string;
    title?: string;
    isGroup?: boolean;
    description?: string;
    removeImageHandler?: () => void;
    pickImage?: () => void;
    isStudent?: boolean;
}

export const EditPhoto = ({
    image,
    pickImage,
    isGroup = false,
    removeImageHandler,
    isStudent = false,
    title = t("Change photo").toString(),
    description = t("Your photo is only visible to your instructors").toString(),
}: Props): ReactElement => {
    return (
        <View style={styles.photoContainer}>
            <TouchableWithoutFeedback
                accessibilityRole="button"
                onPress={() =>
                    isStudent
                        ? null
                        : Alert.alert(
                              title,
                              description,
                              [
                                  { text: t("Cancel").toString() },
                                  {
                                      text: t("Remove photo").toString(),
                                      onPress: () => removeImageHandler && removeImageHandler(),
                                  },
                                  {
                                      text: t("Choose").toString(),
                                      onPress: () => pickImage && pickImage(),
                                  },
                              ],

                              { cancelable: true },
                          )
                }
            >
                <View style={styles.photo}>
                    <ImageBackground
                        accessibilityIgnoresInvertColors
                        source={
                            isGroup
                                ? image
                                    ? { uri: image }
                                    : require("assets/mathify.png")
                                : {
                                      uri: image ? image : blankUser,
                                  }
                        }
                        style={styles.photo}
                    >
                        <View
                            style={[
                                styles.bottomSection,
                                isGroup && styles.alternativeBackground,
                                isStudent && styles.noEdit,
                            ]}
                        >
                            <CustomText
                                style={isGroup ? styles.alternativeEditText : styles.editText}
                            >
                                {t("Edit")}
                            </CustomText>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    photoContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "flex-end",
        alignItems: "center",
        overflow: "hidden",
    },
    bottomSection: {
        width: 120,
        height: 35,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    editText: {
        color: "white",
        fontWeight: "bold",
    },
    alternativeEditText: {
        color: "black",
        fontWeight: "bold",
    },
    alternativeBackground: { backgroundColor: "#ebeef2" },
    noEdit: { backgroundColor: "transparent" },
});
