import { ReactElement, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CheckBox, IndexPath, Select, SelectItem } from "@ui-kitten/components";
import { t } from "i18next";

import { User } from "schema/types";

import { CustomButton, CustomText } from "../UI/CustomElements";
import { ErrorMessage } from "../UI/ErrorMessage";

interface Props {
    onClose: () => void;
    students: User[];
    addStudent: (studentIds: string[]) => void;
}

export const AddStudentModal = ({ onClose, students, addStudent }: Props): ReactElement => {
    const [termsChecked, setTermsChecked] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState([new IndexPath(0)]);
    const [error, setError] = useState<string | null>(null);

    if (students.length === 0) {
        return (
            <CustomText className="mt-3 text-center text-lg">{t("No students to add")}</CustomText>
        );
    }

    const selectedStudentIds = selectedIndex.map((index) => students[index.row]?.userId);
    const displayValue = selectedIndex
        .map(
            (index) =>
                `${students[index.row]?.username.firstName} ${
                    students[index.row]?.username.lastName
                }`,
        )
        .join(", ");

    const addStudentsHandler = () => {
        if (selectedStudentIds.length === 0) {
            setError(t("Please select at least one student"));
            return;
        }
        addStudent(selectedStudentIds);
    };

    const closeModal = () => {
        setError(null);
        onClose();
    };

    return (
        <View className="flex-1 gap-3 p-4">
            <View className="flex-row justify-between">
                <CustomText className="text-3xl">{t("Select a student")}</CustomText>
                <Ionicons
                    name="close-circle-outline"
                    size={36}
                    color="black"
                    onPress={closeModal}
                />
            </View>
            <Select
                placeholder={t("Please select a student").toString()}
                value={displayValue ? displayValue : t("Please select a student").toString()}
                selectedIndex={selectedIndex}
                onSelect={(index) => {
                    setError(null);
                    setSelectedIndex(index as IndexPath[]);
                }}
                multiSelect
            >
                {students.map((student) => (
                    <SelectItem
                        title={`${student.username.firstName} ${student.username.lastName}`}
                        key={student.userId}
                    />
                ))}
            </Select>
            {error ? <ErrorMessage error={error} /> : null}
            <CheckBox
                checked={termsChecked}
                onChange={(nextChecked) => setTermsChecked(nextChecked)}
                status="success"
                style={styles.checkbox}
            >
                {t("By checking this box you add students to this course.").toString()}
            </CheckBox>
            <CustomButton onPress={addStudentsHandler} disabled={!termsChecked}>
                {selectedStudentIds.length > 1
                    ? t("Add students").toString()
                    : t("Add student").toString()}
            </CustomButton>
        </View>
    );
};

const styles = StyleSheet.create({
    checkbox: {
        marginVertical: 18,
        fontSize: 18,
    },
});
