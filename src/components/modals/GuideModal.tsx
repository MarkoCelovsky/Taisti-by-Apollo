import { ReactElement } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text } from "@ui-kitten/components";
import { t } from "i18next";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";

import { CustomText } from "../UI/CustomElements";

interface Props {
    title: string;
    text: string;
    img: string;
    handleCloseModal: () => void;
}

export const GuideModal = (guide: Props): ReactElement => {
    return (
        <BottomSheetView style={styles.modal}>
            <ScrollView style={styles.rootContainer}>
                <Image
                    style={{ height: 140, width: 300, borderRadius: 8 }}
                    source={{ uri: guide.img }}
                    accessibilityIgnoresInvertColors
                />

                <CustomText className="mt-4 text-lg font-bold text-white" style={{ fontSize: 24 }}>
                    {guide.title}
                </CustomText>
                <CustomText className="mt-10 text-white">{guide.text}</CustomText>
            </ScrollView>
        </BottomSheetView>
    );
};

const styles = StyleSheet.create({
    modal: { padding: 16, paddingBottom: 32, height: "100%" },
    rootContainer: { padding: 16, height: 400 },
    ctr: { marginVertical: 12, gap: 2 },
});
