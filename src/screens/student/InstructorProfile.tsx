import {
    ReactElement,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Image,
    ImageBackground,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { getDownloadURL, ref } from "firebase/storage";
import { t } from "i18next";

import { ContactModal } from "components/modals/ContactModal";
import { ListHeading } from "components/UI/ListHeading";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { VehicleCard } from "components/UI/VehicleCard";
import { useChat } from "context/chat-context";
import { useAdmin } from "hooks/useAdmin";
import { useDrivingSchool } from "hooks/useDrivingSchool";
import { InstructorProfileType, RootStackNavigatorParamList } from "schema/navigationTypes";
import { Car, Instructor } from "schema/types";
import { storage } from "utils/firebase.config";
import { CustomText } from "components/UI/CustomElements";

const headerRightComponent = (openModal: () => void) => (
    <Pressable
        accessibilityRole="button"
        onPress={openModal}
        style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            paddingLeft: 25,
        })}
    >
        <Ionicons name="paper-plane-outline" size={27} />
    </Pressable>
);
export const InstructorProfile = (): ReactElement => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { params } = useRoute<InstructorProfileType>();
    const [isLoading, setIsLoading] = useState(true);
    const [cars, setCars] = useState<Car[]>([]);
    const [drivingSchoolLogo, setDrivingSchoolLogo] = useState("");
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const { getAdmin, getAdminStats, getAdminCars } = useAdmin(params.drivingSchoolId);
    const { getDrivingSchool } = useDrivingSchool();
    const [instructor, setInstructor] = useState<Instructor | null>(null);
    const { setOptions } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();
    const { createTempChat } = useChat();
    const snapPoints = useMemo(() => ["35%", "50%"], []);

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

    useLayoutEffect(() => {
        setOptions({
            headerRight: () => headerRightComponent(openModalHandler),
        });
    }, [openModalHandler, setOptions]);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            try {
                const instructorData = await getAdmin(params.instructorId);
                const instructorStats = await getAdminStats(params.instructorId);
                const fetchedCars = await getAdminCars(params.instructorId);
                const fetchedDS = await getDrivingSchool(params.drivingSchoolId);

                if (instructorData && instructorStats) {
                    setInstructor({ ...instructorData, ...instructorStats });
                }
                fetchedDS && setDrivingSchoolLogo(fetchedDS.logoURL);
                setCars(fetchedCars);
                const imageRef = ref(
                    storage,
                    `background-images/${params.instructorId}__background_200x200`,
                );
                const imageUrl = await getDownloadURL(imageRef);
                setBackgroundImage(imageUrl);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        getData();
    }, [
        getAdmin,
        getAdminCars,
        getAdminStats,
        getDrivingSchool,
        params.drivingSchoolId,
        params.instructorId,
    ]);

    const contactHandler = () => {
        instructor?.phoneNumber && Linking.openURL(`tel:${instructor.phoneNumber}`);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!instructor) {
        return (
            <View className="items-center">
                <CustomText category="h5">{t("Could not get any data...").toString()}</CustomText>
            </View>
        );
    }

    const onMessage = () => {
        handleCloseModal();
        createTempChat(instructor);
    };
    return (
        <ScrollView contentContainerStyle={styles.rootContainer}>
            <View style={styles.fullSpace}>
                <View style={styles.backgroundImage}>
                    <ImageBackground
                        accessibilityIgnoresInvertColors
                        source={
                            backgroundImage
                                ? { uri: backgroundImage }
                                : require("assets/class-students.jpeg")
                        }
                        resizeMode="cover"
                        style={styles.fullSpace}
                    >
                        <View style={styles.images}>
                            <Image
                                source={{ uri: instructor.photoURL || "" }}
                                accessibilityIgnoresInvertColors
                                style={styles.image}
                                borderRadius={100}
                            />
                            <Image
                                source={{ uri: drivingSchoolLogo }}
                                accessibilityIgnoresInvertColors
                                style={styles.image1}
                                borderRadius={8}
                            />
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.instructorData}>
                    <CustomText style={styles.title}>
                        {`${instructor.username.firstName} ${instructor.username.lastName}`}
                    </CustomText>
                    <View style={styles.verifiedContainer}>
                        <View style={styles.verifiedDot} />
                        <CustomText category="p1">{t("Verified instructor").toString()}</CustomText>
                    </View>
                </View>
                <View className="px-4">
                    <CustomText category="p2">{instructor.portrayal}</CustomText>
                </View>
                <View className="mt-3">
                    <ListHeading heading="instructor-garage" />
                    <FlashList
                        data={cars}
                        renderItem={({ item }) => <VehicleCard vehicle={item} />}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        estimatedItemSize={200}
                        contentContainerStyle={styles.garage}
                    />
                </View>
            </View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onDismiss={() => bottomSheetModalRef.current?.dismiss()}
                backdropComponent={renderBackdrop}
            >
                <ContactModal
                    onCancel={handleCloseModal}
                    onCall={contactHandler}
                    name={instructor.fullName}
                    phoneNumber={instructor.phoneNumber}
                    onMessage={onMessage}
                />
            </BottomSheetModal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flexGrow: 1, paddingBottom: 44 },
    fullSpace: { flex: 1 },
    instructorData: { flex: 1, padding: 16, paddingTop: 24 },
    images: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        position: "relative",
        top: "30%",
    },
    garage: { paddingBottom: 75 },
    subHeading: { marginLeft: 16, marginBottom: 8, fontSize: 22, fontWeight: "600" },
    image: { width: 150, height: 150 },
    backgroundImage: { width: "100%", height: "30%", backgroundColor: "gray", marginBottom: 40 },
    image1: { width: 60, height: 60, right: "8%", position: "absolute" },
    verifiedContainer: { flexDirection: "row", alignItems: "center", marginVertical: 4, gap: 6 },
    verifiedDot: { height: 18, width: 18, borderRadius: 16, backgroundColor: "#0FC186" },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 18,
    },
    statContainer: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    middleStatContainer: {
        alignItems: "center",
        paddingHorizontal: 20,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderLeftColor: "#B8BBC7",
        borderRightColor: "#B8BBC7",
    },
    statHeading: { fontSize: 22, fontWeight: "600", color: "#929292", marginBottom: 2 },
    title: { fontSize: 26, fontWeight: "700" },
    amount: { fontSize: 20, fontWeight: "700" },
});

// const displayNumber = (num: number) => {
//     const base = Math.floor(num / 100) * 100;
//     if (num < 100) {
//         return num.toString();
//     } else {
//         return `${base}+`;
//     }
// };
// eslint-disable-next-line no-lone-blocks
{
    /* <View style={styles.statsContainer}>
<View style={styles.statContainer}>
    <CustomText style={styles.statHeading}>Rides</CustomText>
    <CustomText style={styles.amount}>
        {displayNumber(instructor.stats.rides)}
    </CustomText>
</View>
<View style={styles.middleStatContainer}>
    <CustomText style={styles.statHeading}>Lessons</CustomText>
    <CustomText style={styles.amount}>
        {displayNumber(instructor.stats.lessons)}
    </CustomText>
</View>
<View style={styles.statContainer}>
    <CustomText style={styles.statHeading}>Courses</CustomText>
    <CustomText style={styles.amount}>
        {displayNumber(instructor.stats.courses)}
    </CustomText>
</View>
</View>
<CustomButton onPress={contactHandler} status="info">
Contact
</CustomButton> */
}
