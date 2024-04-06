import { ReactElement, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { CheckBox } from "@ui-kitten/components";
import { t } from "i18next";

import { Application } from "schema/types";

import { CustomButton, CustomText } from "../UI/CustomElements";

interface Props {
    handleCloseModal: () => void;
    submitApplication: (drivingSchoolId: string) => void;
    openWebHandler: (name: string) => void;
    pendingApplication: Application | null;
}

export const RequestApplicationModal = ({
    handleCloseModal,
    submitApplication,
    openWebHandler,
    pendingApplication,
}: Props): ReactElement => {
    const [termsChecked, setTermsChecked] = useState(false);

    const submitHandler = () => {
        submitApplication(drivingSchool.docId);
        handleCloseModal();
    };

    return (
        <View style={styles.rootContainer}>
            <View style={styles.imgCtr}>
                <CustomText category="h4">{drivingSchool.name}</CustomText>
                <Image
                    source={{ uri: drivingSchool.logoURL ? drivingSchool.logoURL : "" }}
                    className="mr-2 h-16 w-16 rounded-full"
                    accessibilityIgnoresInvertColors
                />
            </View>
            <View style={styles.containerLeft}>
                <View style={styles.textCtr}>
                    <View style={styles.icon}>
                        <FontAwesome5 name="warehouse" size={20} color="black" />
                    </View>
                    <CustomText category="p1">{drivingSchool.address.address}</CustomText>
                </View>
                <View style={styles.textCtr}>
                    <View style={styles.icon}>
                        <Entypo name="email" size={20} color="black" />
                    </View>
                    <CustomText category="p1">{drivingSchool.email}</CustomText>
                </View>
                <View style={styles.textCtr}>
                    <View style={styles.icon}>
                        <Entypo name="old-phone" size={20} color="black" />
                    </View>
                    <CustomText category="p1">{drivingSchool.phoneNumber}</CustomText>
                </View>
            </View>

            <MapView
                style={styles.map}
                minZoomLevel={1}
                initialRegion={{
                    latitude: +drivingSchool.address.lat,
                    longitude: +drivingSchool.address.lng,
                    latitudeDelta: 0.0006,
                    longitudeDelta: 0.001,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: +drivingSchool.address.lat,
                        longitude: +drivingSchool.address.lng,
                    }}
                    title={drivingSchool.address.address}
                />
            </MapView>

            {pendingApplication ? null : (
                <CheckBox
                    checked={termsChecked}
                    onChange={(nextChecked) => setTermsChecked(nextChecked)}
                    status="success"
                    style={styles.checkbox}
                >
                    {t("terms").toString()}
                </CheckBox>
            )}
            <View style={styles.buttonsCtr}>
                {pendingApplication ? (
                    <CustomText category="p1">
                        {t("You already have a pending application")}
                    </CustomText>
                ) : null}
                <CustomButton
                    onPress={() => openWebHandler(drivingSchool.name)}
                    status="success"
                    appearance="outline"
                >
                    {t("See more info").toString()}
                </CustomButton>
                {pendingApplication ? (
                    <CustomButton onPress={handleCloseModal} status="danger">
                        {t("Close").toString()}
                    </CustomButton>
                ) : (
                    <CustomButton
                        onPress={submitHandler}
                        disabled={!termsChecked || !!pendingApplication}
                    >
                        {t("Submit application").toString()}
                    </CustomButton>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1, padding: 16 },
    buttonsCtr: { gap: 8 },
    textCtr: { flexDirection: "row", alignItems: "center", justifyContent: "flex-start" },
    containerLeft: { gap: 6, alignItems: "flex-start", justifyContent: "center" },
    imgCtr: {
        maxWidth: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    icon: { width: 35 },
    map: { width: "100%", height: "20%", marginVertical: 12 },
    checkbox: {
        marginVertical: 18,
        fontSize: 18,
    },
});
