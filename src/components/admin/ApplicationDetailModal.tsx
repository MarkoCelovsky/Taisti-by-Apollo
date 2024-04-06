import { ReactElement, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IndexPath, Select, SelectItem } from "@ui-kitten/components";
import { t } from "i18next";
import moment from "moment";

import { CustomButton, CustomText } from "components/UI/CustomElements";
import { Application, Group } from "schema/types";

interface Props {
    application: Application | null;
    groups: Group[];
    handleCloseModal: () => void;
    approveApplication: (docId: string, applicantId: string, groupId: string) => void;
    disapproveApplication: (docId: string) => void;
}

export const ApplicationDetailModal = ({
    application,
    groups,
    handleCloseModal,
    approveApplication,
    disapproveApplication,
}: Props): ReactElement => {
    const [selectedGroupIndex, setSelectedGroupIndex] = useState(new IndexPath(0));

    const selectedGroup = groups[selectedGroupIndex.row];

    if (!application) {
        return (
            <View style={styles.rootContainer}>
                <View className="flex-row justify-between">
                    <CustomText className="text-3xl">{t("Driving school not found")}</CustomText>
                    <Ionicons
                        name="close-circle-outline"
                        size={36}
                        color="black"
                        onPress={handleCloseModal}
                    />
                </View>
                <CustomText className="text-xl font-bold">
                    {t("Sorry we can't find data about selected driving school")}
                </CustomText>
            </View>
        );
    }

    const approveHandler = () => {
        if (!selectedGroup) return;
        approveApplication(application.docId, application.applicant.userId, selectedGroup.groupId);
    };

    return (
        <View style={styles.rootContainer}>
            <View className="flex-row justify-between ">
                <CustomText className="text-3xl">{t("Application detail")}</CustomText>
                <Ionicons
                    name="close-circle-outline"
                    size={36}
                    color="black"
                    onPress={handleCloseModal}
                />
            </View>
            <CustomText>{application.applicant.username}</CustomText>
            <CustomText>{application.applicant.email}</CustomText>
            <Select
                placeholder={t("Please select a group").toString()}
                value={selectedGroup ? selectedGroup.name : t("Please select a group").toString()}
                selectedIndex={selectedGroupIndex}
                onSelect={(index) => {
                    setSelectedGroupIndex(index as IndexPath);
                }}
            >
                {groups.map((group) => (
                    <SelectItem title={group.name} key={group.groupId} />
                ))}
            </Select>
            <CustomText>{`${t("from")} ${moment(new Date(application.createdAt)).format(
                "DD/MM/YY",
            )}`}</CustomText>
            <View className="flex-row justify-end gap-2">
                <CustomButton
                    appearance="outline"
                    status="danger"
                    onPress={() => disapproveApplication(application.docId)}
                >
                    {t("Decline").toString()}
                </CustomButton>
                <CustomButton status="info" onPress={approveHandler}>
                    {t("Approve").toString()}
                </CustomButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1, padding: 16 },
});
