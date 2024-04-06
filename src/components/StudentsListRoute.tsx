import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { Divider } from "@ui-kitten/components";
import { FirestoreError } from "firebase/firestore";
import { t } from "i18next";
import moment from "moment";

import { useStudent } from "hooks/useStudent";
import { Screens } from "screens/screen-names";
import { mmkvStorage, StorageKeys } from "storage/storage";
import { RootStackNavigatorParamList } from "schema/navigationTypes";
import { StudentWithRide } from "schema/types";

import { CustomInput, CustomText } from "./UI/CustomElements";
import { ErrorMessage } from "./UI/ErrorMessage";
import { LoadingSpinner } from "./UI/LoadingSpinner";
import { UserListItem } from "./UI/UserListItem";

const StudentsListRoute = (): ReactElement => {
    const [students, setStudents] = useState<StudentWithRide[]>([]);
    const [studentsQuery, setStudentsQuery] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { getAllNextRides } = useRide();
    const { getAllStudents } = useStudent();
    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();

    const getFreshData = useCallback(async () => {
        try {
            setIsLoading(true);
            const nextRides = await getAllNextRides();
            const fetchedStudents = await getAllStudents();
            if (!fetchedStudents) return;
            for (const student of fetchedStudents) {
                const foundRide = nextRides.find((ride) => ride.student?.userId === student.userId);
                if (foundRide) {
                    student.nextRideDate = moment(new Date(foundRide.dayTime)).format(
                        `D/M/YYYY [${t("at")}] HH:mm`,
                    );
                }
            }
            console.log("gettin fresh students");
            setStudents(fetchedStudents);
            mmkvStorage.set(StorageKeys.MyStudents, JSON.stringify(fetchedStudents));
        } catch (err) {
            err instanceof FirestoreError && setError(err.message);
            console.log(err);
            return;
        } finally {
            setIsLoading(false);
        }
        setError(null);
    }, [getAllNextRides, getAllStudents]);

    const getData = useCallback(async () => {
        try {
            setIsLoading(true);
            const nextRides = await getAllNextRides();
            const cachedStudents = mmkvStorage.getString(StorageKeys.MyStudents);
            if (cachedStudents) {
                const studentsArray = JSON.parse(cachedStudents) as StudentWithRide[];
                for (const student of studentsArray) {
                    const foundRide = nextRides.find(
                        (ride) => ride.student?.userId === student.userId,
                    );
                    if (foundRide) {
                        student.nextRideDate = moment(new Date(foundRide.dayTime)).format(
                            `D/M/YYYY [${t("at")}] HH:mm`,
                        );
                    }
                }
                console.log("gettin cached students");
                setStudents(studentsArray);
                setIsLoading(false);
            } else {
                getFreshData();
            }
        } catch (err) {
            err instanceof FirestoreError ? setError(err.message) : console.error(err);
            const cachedStudents = mmkvStorage.getString("my-students");
            cachedStudents && setStudents(JSON.parse(cachedStudents) as StudentWithRide[]);
            setIsLoading(false);
            return;
        }
        setError(null);
    }, [getAllNextRides, getFreshData]);

    useEffect(() => {
        getData();
    }, [getData]);

    const filteredStudents = useMemo(
        () =>
            students.filter(
                (student) =>
                    student.username.firstName
                        .toLowerCase()
                        .includes(studentsQuery.toLowerCase()) ||
                    student.username.lastName.toLowerCase().includes(studentsQuery.toLowerCase()) ||
                    student.email.toLowerCase().includes(studentsQuery.toLowerCase()),
            ),
        [students, studentsQuery],
    );

    const accessoryRightComponent = () => (
        <Ionicons name="close" size={24} color="lightgray" onPress={() => setStudentsQuery("")} />
    );

    const renderIcon = () => <Ionicons name="search" size={24} color="lightgray" />;

    return (
        <FlashList
            refreshControl={<RefreshControl refreshing={false} onRefresh={getFreshData} />}
            estimatedItemSize={70}
            ListHeaderComponent={
                <>
                    <CustomInput
                        value={studentsQuery}
                        onChangeText={(text) => setStudentsQuery(text)}
                        placeholder={t("Search").toString()}
                        size="medium"
                        style={styles.input}
                        accessoryRight={accessoryRightComponent}
                        accessoryLeft={renderIcon}
                    />
                    {isLoading ? <LoadingSpinner style={styles.loadingSpinner} /> : null}
                    {error ? <ErrorMessage error={error} /> : null}
                </>
            }
            ListEmptyComponent={
                isLoading ? (
                    <></>
                ) : (
                    <CustomText className="mt-2 text-center">
                        {t("List of students is empty")}
                    </CustomText>
                )
            }
            ItemSeparatorComponent={Divider}
            contentContainerStyle={styles.list}
            data={filteredStudents}
            renderItem={({ item }) => (
                <UserListItem
                    onPress={() =>
                        navigate(Screens.StudentProfile, {
                            student: item,
                        })
                    }
                    photoURL={item.photoURL}
                    isBold={!!item.nextRideDate}
                    title={`${item.username.firstName} ${item.username.lastName}`}
                    subtitle={
                        item.nextRideDate
                            ? `${t("Next ride on")} ${item.nextRideDate}`
                            : t("No next ride booked").toString()
                    }
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    list: { paddingTop: 16 },
    loadingSpinner: {
        margin: 12,
    },
    input: { marginHorizontal: 12 },
});

export default StudentsListRoute;
