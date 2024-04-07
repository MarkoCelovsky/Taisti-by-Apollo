import { ReactElement, useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { useAuth } from "context/auth-context";
import { CustomText } from "components/UI/CustomElements";
import { Image } from "expo-image";
import { Stock } from "schema/types";
import { CustomInput } from "components/UI/CustomElements";
import { GuideModal } from "components/modals/GuideModal";

const guides = [
    {
        id: 1,
        title: "Investing 101: Your Ultimate Beginner's Guide",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et",
        img: "https://picsum.photos/300/140",
    },
    {
        id: 2,
        title: "Demystifying Investments",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et, consequat nisl. Nulla facilisi. Nullam ac nunc sit amet elit ultricies posuere. Donec auctor, libero nec ultricies posuere, libero nunc ultrices odio, nec imperdiet nunc odio sit amet nunc. Nulla nec purus feugiat, molestie ipsum et",
        img: "https://picsum.photos/300/140",
    },
];

export const Community = (): ReactElement => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { userId, user } = useAuth();
    const [selectedGuide, setSelectedGuide] = useState<{
        title: string;
        text: string;
        img: string;
    }>({
        title: "",
        text: "",
        img: "",
    });

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

    const openGuide = (guide: any) => {
        setSelectedGuide(guide);
        openModalHandler();
    };

    if (!userId || !user) {
        return <LoadingSpinner />;
    }

    return (
        <SafeAreaView style={styles.rootContainer}>
            <View style={styles.userBar}>
                <Image
                    style={{ height: 60, width: 60, marginRight: 32 }}
                    source={{ uri: user?.photoURL || "" }}
                    accessibilityIgnoresInvertColors
                />
                <CustomInput placeholder="Search" className="w-2/3" />
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.cardContainer}>
                    {guides.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            accessibilityRole="button"
                            activeOpacity={0.5}
                            accessibilityIgnoresInvertColors
                            onPress={() => openGuide(item)}
                        >
                            <Card item={item} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                // enableDynamicSizing
                snapPoints={["90%"]}
                onDismiss={handleCloseModal}
                backdropComponent={renderBackdrop}
                backgroundStyle={{
                    backgroundColor: "#242728",
                }}
            >
                <GuideModal
                    text={selectedGuide.text}
                    title={selectedGuide.title}
                    img={selectedGuide.img}
                    handleCloseModal={handleCloseModal}
                />
            </BottomSheetModal>
        </SafeAreaView>
    );
};

const Card = ({ item }: { item: any }) => (
    <View
        style={{
            backgroundColor: "#242728",
            borderRadius: 8,
            marginVertical: 8,
            width: "90%",
        }}
        className="mx-auto my-2 flex-col justify-center"
    >
        <View className="flex flex-col p-4">
            <Image
                style={{ height: 140, width: 300, borderRadius: 8 }}
                source={{ uri: item.img }}
                accessibilityIgnoresInvertColors
            />
            <View className="mt-2">
                <CustomText category="h6" style={{ color: "#fff" }}>
                    {item.title}
                </CustomText>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    rootContainer: { flexGrow: 1, backgroundColor: "#181921", color: "#fff" },
    userBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    cardContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    contentContainer: {
        flexGrow: 1,
        paddingTop: 8,
    },
});
