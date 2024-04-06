import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import Toast from "react-native-toast-message";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Divider } from "@ui-kitten/components";
import {
    arrayRemove,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { scheduleLocalNotification } from "helperFunctions/index";
import { t } from "i18next";
import moment from "moment";

import { CustomToast } from "components/CustomToast";
import { MessageItem } from "components/UI/MessageItem";
import { useAuth } from "context/auth-context";
import { useAdmin } from "hooks/useAdmin";
import { useNotification } from "hooks/useNotification";
import { Screens } from "screens/screen-names";
import { RootStackNavigatorParamList } from "schema/navigationTypes";
import { Message, NotificationTypes, Place, Ride } from "schema/types";
import { db, notificationsCol } from "utils/firebase.config";
import { CustomButton, CustomText } from "components/UI/CustomElements";
import { LoadingSpinner } from "components/UI/LoadingSpinner";

export const Notifications = (): ReactElement => {
    const [isLoading, setIsLoading] = useState(true);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const isFocused = useIsFocused();
    const [lastMinuteRide, setLastMinuteRide] = useState<Ride | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const { userId, user } = useAuth();
    const notify = useNotification();
    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();

    const getMessages = useCallback(async () => {
        const msgs: Message[] = [];
        setIsLoading(true);
        try {
            const q = query(
                notificationsCol(user?.drivingSchoolId || ""),
                where("receiverId", "array-contains", userId),
                orderBy("createdAt", "desc"),
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((document) => {
                const data = {
                    ...(document.data() as Message),
                    docId: document.id,
                };
                msgs.push(data);
            });
            setMessages(msgs);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user?.drivingSchoolId, userId]);

    useEffect(() => {
        isFocused && getMessages();
    }, [isFocused, getMessages]);

    const snapPoints = useMemo(() => ["55%", "90%"], []);

    const openModalHandler = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleCloseModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);

    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        ),
        [],
    );

    const openMessageModal = async (message: Message) => {
        try {
            setIsLoading(true);
            if (message.rideId) {
                const rideData = await getRide(message.rideId);
                setLastMinuteRide(rideData);
            }
            setSelectedMessage(message);
            openModalHandler();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addPlaceNavigateHandler = useCallback(() => {
        navigate(Screens.MyPlaces);
        handleCloseModal();
    }, [navigate, handleCloseModal]);

    const showInstructorProfileHandler = (instructorId: string) => {
        handleCloseModal();
        navigate(Screens.InstructorProfile, {
            instructorId,
            drivingSchoolId: user?.drivingSchoolId ? user.drivingSchoolId : "",
        });
    };

    const bookRideHandler = useCallback(
        async (rideId: string, startRideFrom: Place, dayTime: number) => {
            if (!user) {
                return Toast.show({
                    type: "error",
                    text1: t("Can't book a ride!").toString(),
                    text2: t("Sorry something went wrong!").toString(),
                });
            }
            try {
                const ride = await getRide(rideId);

                if (ride && ride.booked) {
                    setMessages((curr) =>
                        curr.filter((msg) => msg.docId !== selectedMessage?.docId),
                    );
                    handleCloseModal();
                    // TODO: maybe implement some failed booking screen
                    return Toast.show({
                        type: "error",
                        text1: t("Somebody already took it!").toString(),
                        text2: t("Sorry something went wrong!").toString(),
                    });
                }

                await updateDoc(doc(db, `drivingSchools/${user.drivingSchoolId}/rides/${rideId}`), {
                    student: {
                        userId: user.userId,
                        username: user.username,
                        photoURL: user.photoURL,
                        phoneNumber: user.phoneNumber,
                    },
                    booked: true,
                    goFrom: startRideFrom,
                });
                setMessages((curr) => curr.filter((msg) => msg.docId !== selectedMessage?.docId));
                await deleteDoc(
                    doc(
                        db,
                        `drivingSchools/${user?.drivingSchoolId}/messages/${selectedMessage?.docId}`,
                    ),
                );
                const includes = user.notificationPreferences.includes(NotificationTypes.REMINDER);
                // TODO: notify instructor that the ride has been already booked
                if (includes) {
                    scheduleLocalNotification(dayTime, ["24", "1"]);
                }
                const inst = await getAdmin(ride?.docId || "");
                inst &&
                    (await notify({
                        receiverId: [inst.userId],
                        to: [inst.deviceToken || ""],
                        title: "Last minute jazda rezervovaná",
                        message: `Študent ${user.fullName} sa prihlásil na jazdu dňa ${moment(
                            ride?.dayTime,
                        ).format("D/M/YYYY [o] HH:mm")}`,
                    }));
            } catch (err) {
                handleCloseModal();
                Toast.show({
                    type: "error",
                    text1: t("Can't book a ride!").toString(),
                    text2: t("Sorry something went wrong!").toString(),
                });
                return;
            }
            handleCloseModal();
            setLastMinuteRide(null);
            navigate(Screens.SuccessBooking);
        },
        [user, handleCloseModal, navigate, getRide, selectedMessage, getAdmin, notify],
    );

    const removeMessageHandler = async (msgId: string) => {
        const foundMsg = messages.find((msg) => msg.docId === msgId);
        try {
            foundMsg?.receiverId && foundMsg?.receiverId.length > 1
                ? await updateDoc(
                      doc(db, `drivingSchools/${user?.drivingSchoolId}/messages/${msgId}`),
                      {
                          receiverId: arrayRemove(userId),
                      },
                  )
                : await deleteDoc(
                      doc(db, `drivingSchools/${user?.drivingSchoolId}/messages/${msgId}`),
                  );
            setMessages((curr) => curr.filter((msg) => msg.docId !== msgId));
        } catch (err) {
            console.error(err);
        }
    };

    const renderHiddenItem = (msgId: string, closeRow: () => void) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                accessibilityRole="button"
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => {
                    closeRow();
                    removeMessageHandler(msgId);
                }}
            >
                <View style={styles.deleteContainer}>
                    <FontAwesome5 name="trash-alt" size={24} color="white" />
                    <CustomText style={styles.backTextWhite}>{t("Delete").toString()}</CustomText>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            {isLoading ? <LoadingSpinner withBackground /> : null}
            <SwipeListView
                data={messages}
                refreshControl={<RefreshControl refreshing={false} onRefresh={getMessages} />}
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="mt-[50%] h-40 flex-1 items-center justify-center">
                            <CustomText category="h6">
                                {t("You don't have any unread messages...")}
                            </CustomText>
                        </View>
                    ) : null
                }
                ItemSeparatorComponent={Divider}
                keyExtractor={(item) => item.docId}
                renderItem={({ item }, rowMap) => (
                    <MessageItem
                        message={item}
                        onLongPress={() =>
                            Alert.alert(
                                t("Remove message").toString(),
                                t("By continuing you can remove this notification.").toString(),
                                [
                                    { text: t("Cancel").toString() },
                                    {
                                        isPreferred: true,
                                        text: t("Remove").toString(),
                                        onPress: () => {
                                            rowMap[item.docId].closeRow();
                                            removeMessageHandler(item.docId);
                                        },
                                    },
                                ],
                                { cancelable: true },
                            )
                        }
                        onPress={() => openMessageModal(item)}
                    />
                )}
                renderHiddenItem={({ item }, rowMap) =>
                    renderHiddenItem(item.docId, () => rowMap[item.docId].closeRow())
                }
                rightOpenValue={-75}
            />
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onDismiss={() => bottomSheetModalRef.current?.dismiss()}
                backdropComponent={renderBackdrop}
            >
                {selectedMessage?.rideId ? (
                    <ReserveRideModal
                        ride={lastMinuteRide}
                        bookRideHandler={bookRideHandler}
                        handleCloseModal={handleCloseModal}
                        addPlaceNavigateHandler={addPlaceNavigateHandler}
                        places={user?.places || []}
                        showInstructorProfile={showInstructorProfileHandler}
                    />
                ) : (
                    <NotificationModal
                        message={selectedMessage}
                        handleCloseModal={handleCloseModal}
                        onDelete={removeMessageHandler}
                    />
                )}
            </BottomSheetModal>
            <CustomToast />
        </>
    );
};

const styles = StyleSheet.create({
    rowBack: {
        alignItems: "center",
        flexDirection: "row",
        height: 65,
        justifyContent: "space-between",
        paddingLeft: 15,
        overflow: "hidden",
    },
    backRightBtn: {
        alignItems: "center",
        bottom: 0,
        justifyContent: "center",
        position: "absolute",
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: "#DC0E40",
        right: 0,
        padding: 8,
    },
    backTextWhite: {
        color: "#FFF",
        marginTop: 2,
        fontSize: 12,
    },
    deleteContainer: { justifyContent: "center", alignItems: "center" },
});

interface Props {
    message: Message | null;
    handleCloseModal: () => void;
    onDelete: (msgId: string) => void;
}

const NotificationModal = ({ message, handleCloseModal, onDelete }: Props) => {
    if (!message) {
        return (
            <View className="flex-1 p-4">
                <View className="flex-row justify-between">
                    <CustomText category="h4">{t("Notification not found")}</CustomText>
                    <Ionicons
                        name="close-circle-outline"
                        size={36}
                        color="black"
                        onPress={handleCloseModal}
                    />
                </View>
                <CustomText className="text-xl font-bold ">
                    {t("Sorry we can't find data about your notification")}
                </CustomText>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4">
            <View className="mb-2 flex-row justify-between">
                <CustomText category="h4">{message.title}</CustomText>
                <Ionicons
                    name="close-circle-outline"
                    size={36}
                    color="black"
                    onPress={handleCloseModal}
                />
            </View>
            <CustomText category="h6">{message.message}</CustomText>
            <View className="items-end">
                <CustomButton
                    status="danger"
                    onPress={() => {
                        onDelete(message.docId);
                        handleCloseModal();
                    }}
                >
                    {t("Delete").toString()}
                </CustomButton>
            </View>
        </View>
    );
};
