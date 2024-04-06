import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { getCountFromServer, query, where } from "firebase/firestore";
import { dashboardGreeting } from "helperFunctions/index";

import BadgeIcon from "components/UI/BadgeIcon";
import { Heading } from "components/UI/Heading";
import { ListHeading } from "components/UI/ListHeading";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { ProgressCard } from "components/UI/ProgressCard";
import { useAuth } from "context/auth-context";
import { Screens } from "screens/screen-names";
import { RootStackNavigatorParamList } from "schema/navigationTypes";
import { notificationsCol } from "utils/firebase.config";
import { CustomButton, CustomText } from "components/UI/CustomElements";
import { Equation } from "schema/types";

export const Dashboard = (): ReactElement => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { userId, user } = useAuth();
    const [equations, setEquations] = useState<Equation[]>([]);
    const [messagesQty, setMessagesQty] = useState(0);
    const isFocused = useIsFocused();
    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();
    const { t } = useTranslation();

    const getNotificationCount = useCallback(async () => {
        let msgs = 0;
        const q = query(
            notificationsCol(user?.groupId || ""),
            where("receiverId", "array-contains", userId),
        );
        const querySnapshot = await getCountFromServer(q);
        msgs = querySnapshot.data().count;
        setMessagesQty(msgs);
    }, [user, userId]);

    useEffect(() => {
        isFocused && getNotificationCount();
    }, [getNotificationCount, isFocused]);

    const openModalHandler = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleCloseModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        ),
        [],
    );

    // const showInstructorProfileHandler = (instructorId: string) => {
    //     handleCloseModal();
    //     navigate(Screens.InstructorProfile, {
    //         instructorId,
    //         drivingSchoolId: user?.drivingSchoolId ? user.drivingSchoolId : "",
    //     });
    // };

    if (!userId || !user) {
        return <LoadingSpinner />;
    }

    return (
        <SafeAreaView style={styles.rootContainer}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {
                            getNotificationCount();
                        }}
                    />
                }
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={styles.container}>
                    <View style={styles.headingContainer}>
                        <View>
                            <Heading>{dashboardGreeting()},</Heading>
                            <CustomText category="h5">
                                {user?.username.firstName}
                                👋
                            </CustomText>
                        </View>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => navigate(Screens.Notifications)}
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.5 : 1,
                                paddingLeft: 25,
                            })}
                        >
                            <View style={styles.iconContainer}>
                                <BadgeIcon badgeCount={messagesQty}>
                                    <Feather name="bell" size={34} color="black" />
                                </BadgeIcon>
                            </View>
                        </Pressable>
                    </View>

                    <CustomText className="mb-3 text-lg font-bold">{t("MyProgress")}</CustomText>
                    <View style={styles.progressContainer}>
                        <ProgressCard
                            activeColor="#906064"
                            value={47}
                            completedAmount={4}
                            backgroundColor="#F4E1E5"
                            title={t("Test")}
                            text={t("TestCompleted")}
                            scale={0.9}
                        />

                        <ProgressCard
                            activeColor="#00008B"
                            value={70}
                            completedAmount={9}
                            backgroundColor="#F3F1FE"
                            title={t("Driving")}
                            text={t("DrivingCompleted")}
                            scale={0.9}
                        />

                        <ProgressCard
                            activeColor="#1F4788"
                            value={39}
                            completedAmount={12}
                            backgroundColor="#EBF4FE"
                            title={t("Lesson")}
                            text={t("LessonCompleted")}
                            scale={0.9}
                        />
                    </View>
                </View>

                <View style={styles.lessonList}>
                    <ListHeading
                        heading="my-equations"
                        showAll
                        navigate={() => navigate(Screens.MyEquations)}
                    />
                    <View>
                        {equations.length ? (
                            <FlashList
                                data={equations}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalList}
                                estimatedItemSize={300}
                                renderItem={({ item }) => <View />}
                            />
                        ) : (
                            <View className="h-40 w-full items-center justify-center">
                                <CustomText style={styles.nextEventHeading}>
                                    {t("no-next-lessons-planned")}
                                </CustomText>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.btn}>
                    <CustomButton size="giant" onPress={() => navigate(Screens.NewEquation)}>
                        New Equation
                    </CustomButton>
                </View>

                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    enableDynamicSizing
                    onDismiss={handleCloseModal}
                    backdropComponent={renderBackdrop}
                >
                    <BottomSheetView style={styles.modal}>
                        <CustomButton onPress={handleCloseModal}>Close</CustomButton>
                        <CustomButton onPress={handleCloseModal}>Do something</CustomButton>
                    </BottomSheetView>
                </BottomSheetModal>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
    modal: { padding: 16 },
    btn: { position: "absolute", bottom: 4, paddingHorizontal: 16, width: "100%" },
    lessonList: { marginTop: 10 },
    scrollContainer: { paddingTop: 16, flexGrow: 1 },
    container: { paddingHorizontal: 16 },
    nextEventHeading: { color: "gray", fontSize: 14 },
    cardCtr: { paddingRight: 16 },
    singleCard: { width: Dimensions.get("screen").width - 16, paddingRight: 16 },
    horizontalList: { paddingLeft: 16 },
    headingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
    },
    progressContainer: { flex: 1, flexDirection: "row", marginBottom: 20, gap: 8 },
    iconContainer: { flex: 1, justifyContent: "center" },
});
