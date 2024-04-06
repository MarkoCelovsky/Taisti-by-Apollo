import { ReactElement } from "react";
import { Image, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { t } from "i18next";
import moment from "moment";

import { CustomText } from "components/UI/CustomElements";
import { Application, ApplicationStatus } from "schema/types";
import { blankUser } from "context/auth-context";

interface Props {
    application: Application;
    onSelect: (doc: Application) => void;
}

const statusConvertor = (status: ApplicationStatus) => {
    switch (status) {
        case ApplicationStatus.approved:
            return t("Approved");
        case ApplicationStatus.pending:
            return t("Pending");
        case ApplicationStatus.declined:
            return t("Declined");
    }
};

export const ApplicationCard = ({ application, onSelect }: Props): ReactElement => {
    return (
        <TouchableOpacity
            style={styles.rootContainer}
            accessibilityRole="button"
            onPress={() => onSelect(application)}
        >
            <View className="flex-row items-center gap-4">
                <View>
                    <Image
                        source={{ uri: application.applicant.photoURL || blankUser }}
                        accessibilityIgnoresInvertColors
                        borderRadius={50}
                        height={60}
                        width={60}
                    />
                </View>
                <View>
                    <CustomText category="h6">{application.applicant.username}</CustomText>
                    <CustomText category="p1">{application.applicant.email}</CustomText>
                    <CustomText category="s1">
                        {t("status") + ": " + statusConvertor(application.status)}
                    </CustomText>
                    <CustomText>
                        {moment(new Date(application.createdAt)).format("DD/MM/YY")}
                    </CustomText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "lightgray",
    },
});
