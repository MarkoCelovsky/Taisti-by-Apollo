import React, { ReactElement, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import ReactNativePhoneInput from "react-native-phone-input";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { t } from "i18next";

import { CustomToast } from "components/CustomToast";
import { CustomButton, CustomInput, CustomText } from "components/UI/CustomElements";
import { EditPhoto } from "components/UI/EditPhoto";
import { KeyboardAvoidingWrapper } from "components/UI/KeyboardAvoidingWrapper";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { blankUser, useAuth } from "context/auth-context";
import { storage } from "utils/firebase.config";

export const EditProfile = (): ReactElement => {
    const phoneRef = useRef<ReactNativePhoneInput>(null);

    const [isDisabled, setIsDisabled] = useState(true);
    const { user, editUser } = useAuth();
    const [firstName, setFirstName] = useState(user ? user?.username.firstName : "");
    const [lastName, setLastName] = useState(user ? user?.username.lastName : "");
    const [image, setImage] = useState<string | null>(user?.photoURL || null);
    const [isUploading, setIsUploading] = useState(false);
    const [imageWasUploaded, setImageWasUploaded] = useState(false);

    const pickImage = async () => {
        const { assets } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!assets) {
            return;
        }
        setImage(assets[0].uri);
        setImageWasUploaded(true);
        setIsDisabled(false);
    };

    const uploadImageHandler = async () => {
        if (!user || !image) {
            return null;
        }
        try {
            const res = await fetch(image);
            const blob = await res.blob();
            const filename = user.userId;
            const imageRef = ref(storage, `profile-images/${filename}`);
            await uploadBytes(imageRef, blob);
            const imageUrl = await getDownloadURL(imageRef);
            //FIXME: this is not ideal, find if firebase offers a better way
            //TODO: create proper way of saving all changes
            const index = imageUrl.indexOf("?alt");
            const resizedUrl = imageUrl.slice(0, index) + "_200x200" + imageUrl.slice(index);
            return resizedUrl;
        } catch (error) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: t("Something went wrong").toString(),
            });
            return null;
        }
    };

    const removeImageHandler = () => {
        setImage(blankUser);
        setImageWasUploaded(false);
        setIsDisabled(false);
    };

    const saveChangesHandler = async () => {
        if (!user) {
            return;
        }
        if (!phoneRef.current?.isValidNumber()) {
            return Toast.show({
                type: "error",
                text1: t("Please enter a valid phone number").toString(),
                text2: t("Entered phone number is not valid").toString(),
            });
        }
        try {
            setIsUploading(true);
            setIsDisabled(true);
            let imageUrl: typeof image = image;
            if (imageWasUploaded) {
                imageUrl = await uploadImageHandler();
            }

            // if (dataHasChanged.phoneNumber && !phoneRef.current?.isValidNumber()) {
            //     return Toast.show({
            //         type: "error",
            //         text1: "Invalid phone number",
            //         text2: "Entered phone number is invalid",
            //     });
            // }
            const phoneNumber = phoneRef.current?.isValidNumber()
                ? phoneRef.current?.getValue()
                : null;

            await editUser({
                photoURL: imageUrl as string,
                username: { firstName, lastName },
                fullName: `${firstName} ${lastName}`,
                phoneNumber,
            });
            await AsyncStorage.setItem(
                "user",
                JSON.stringify({
                    ...user,
                    photoURL: imageUrl,
                    username: { firstName, lastName },
                    phoneNumber,
                }),
            );
            Toast.show({
                text1: t("Changes saved").toString(),
                text2: t("Successfully saved your changes").toString(),
            });
        } catch (err) {
            console.error(err);
            Toast.show({
                type: "error",
                text1: t("Cannot save changes").toString(),
                text2: t("Sorry something went wrong").toString(),
            });
        } finally {
            setIsUploading(false);
            setIsDisabled(true);
        }
    };

    return (
        <KeyboardAvoidingWrapper>
            <SafeAreaView style={styles.rootContainer}>
                {isUploading ? <LoadingSpinner /> : null}
                <View style={styles.editContainer}>
                    <EditPhoto
                        pickImage={pickImage}
                        removeImageHandler={removeImageHandler}
                        image={image ? image : undefined}
                    />
                    <CustomText style={styles.heading}>{t("Name").toString()}</CustomText>
                    <View style={styles.dataContainer}>
                        <CustomInput
                            label={t("First name").toString()}
                            placeholder={t("First name").toString()}
                            style={styles.inputField}
                            value={firstName}
                            onChangeText={(text) => {
                                setFirstName(text);
                                setIsDisabled(text === user?.username.firstName || !text.trim());
                            }}
                        />
                        <CustomInput
                            label={t("Last name").toString()}
                            placeholder={t("Last name").toString()}
                            style={styles.inputField}
                            value={lastName}
                            onChangeText={(text) => {
                                setLastName(text);
                                setIsDisabled(text === user?.username.lastName || !text.trim());
                            }}
                        />
                    </View>
                    <CustomText style={styles.heading}>{t("Contact")}</CustomText>
                    <View style={styles.dataContainer}>
                        <ReactNativePhoneInput
                            ref={phoneRef}
                            autoFormat
                            onChangePhoneNumber={() => {
                                if (
                                    phoneRef.current?.getValue() === user?.phoneNumber ||
                                    !phoneRef.current?.isValidNumber()
                                ) {
                                    setIsDisabled(true);
                                } else {
                                    setIsDisabled(false);
                                }
                            }}
                            // style={styles.phoneNumber}
                            style={[
                                styles.phoneNumber,
                                (!phoneRef.current && !!user?.phoneNumber) ||
                                phoneRef.current?.isValidNumber()
                                    ? null
                                    : styles.invalidInput,
                            ]}
                            initialCountry="sk"
                            initialValue={user?.phoneNumber ? user.phoneNumber : ""}
                        />
                        <CustomText className="ml-1 text-xs">{`${t(
                            "format",
                        )}: +421 900 900 900`}</CustomText>
                    </View>
                </View>
                <CustomButton
                    onPress={saveChangesHandler}
                    disabled={isDisabled}
                    style={styles.button}
                >
                    {t("Save changes").toString()}
                </CustomButton>
                <CustomButton
                    status="danger"
                    appearance="outline"
                    style={styles.button}
                    className="hidden"
                >
                    {t("Delete Profile").toString()}
                </CustomButton>
                <CustomToast />
            </SafeAreaView>
        </KeyboardAvoidingWrapper>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1, padding: 16 },
    editContainer: { flex: 1 },
    dataContainer: { marginVertical: 12 },
    inputField: { marginVertical: 4 },
    heading: { fontWeight: "600", fontSize: 20 },
    button: { marginBottom: 8 },
    phoneNumber: {
        paddingHorizontal: 8,
        marginBottom: 2,
        paddingVertical: 7,
        borderRadius: 4,
        borderWidth: 1,
        minHeight: 48,
        backgroundColor: "#F7F9FC",
        borderColor: "#E4E9F2",
    },
    invalidInput: {
        borderColor: "red",
    },
});
