import { ReactElement, useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { addDoc } from "firebase/firestore";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { useAuth } from "context/auth-context";
import { stocksCol } from "utils/firebase.config";
import { CustomText } from "components/UI/CustomElements";
import { Image } from "expo-image";
import { Stock } from "schema/types";
import { BuyStock } from "components/modals/BuyStock";
import { CustomInput } from "components/UI/CustomElements";
import { PortfolioModal } from "components/modals/PortfolioModal";
import { Icon } from "@ui-kitten/components";
import { Screens } from "screens/screen-names";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackNavigatorParamList } from "schema/navigationTypes";

const portfolios = [
    {
        id: 1,
        name: "John Doe",
        totalProfitSinceLastWeek: -0.7,
        stocks: [
            {
                symbol: "AAPL",
                companyName: "Apple Inc.",
                currentPrice: 150.0,
                finalTotal: 0.0,
            },
            {
                symbol: "GOOGL",
                companyName: "Alphabet Inc.",
                currentPrice: 2500.0,
                finalTotal: 0.0,
            },
            {
                symbol: "TSLA",
                companyName: "Tesla Inc.",
                currentPrice: 700.0,
                finalTotal: 0.0,
            },
        ],
    },
    {
        id: 2,
        name: "John Doe",
        totalProfitSinceLastWeek: 2.7,
        stocks: [
            {
                symbol: "AAPL",
                companyName: "Apple Inc.",
                currentPrice: 150.0,
                finalTotal: 0.0,
            },
            {
                symbol: "GOOGL",
                companyName: "Alphabet Inc.",
                currentPrice: 2500.0,
                finalTotal: 0.0,
            },
            {
                symbol: "TSLA",
                companyName: "Tesla Inc.",
                currentPrice: 700.0,
                finalTotal: 0.0,
            },
        ],
    },
];

export const Community = (): ReactElement => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { userId, user } = useAuth();
    const [selectedPortfolio, setSelectedPortfolio] = useState<any | null>(null);

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

    const openPortfolio = (portfolio: any) => {
        setSelectedPortfolio(portfolio);
        openModalHandler();
    };
    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();

    if (!userId || !user) {
        return <LoadingSpinner />;
    }

    return (
        <SafeAreaView style={styles.rootContainer}>
            <View style={styles.userBar}>
                <TouchableOpacity
                    onPress={() => navigate(Screens.Profile)}
                    accessibilityRole="button"
                >
                    <Image
                        style={{ height: 60, width: 60, marginRight: 8 }}
                        source={{ uri: user.photoURL || "" }}
                        accessibilityIgnoresInvertColors
                    />
                </TouchableOpacity>
                <CustomInput placeholder="Search" style={styles.search} />
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {portfolios.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        accessibilityRole="button"
                        activeOpacity={0.5}
                        accessibilityIgnoresInvertColors
                        onPress={() => openPortfolio(item)}
                    >
                        <Card item={item} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                enableDynamicSizing
                onDismiss={handleCloseModal}
                backdropComponent={renderBackdrop}
                backgroundStyle={{
                    backgroundColor: "#242728",
                }}
            >
                <PortfolioModal portfolio={selectedPortfolio} />
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
            justifyContent: "center",
        }}
        className="mx-auto my-2 flex-col justify-center"
    >
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 16,
            }}
        >
            <View className="flex w-full flex-row items-center justify-between">
                <CustomText category="h6" style={{ color: "#fff" }}>
                    {item.name}
                </CustomText>
                <View
                    style={{
                        backgroundColor: "#4F5355",
                        padding: 4,
                        borderRadius: 4,
                        width: 90,
                    }}
                >
                    <CustomText category="p2" style={{ color: "#fff" }}>
                        {item.totalProfitSinceLastWeek > 0
                            ? `+${item.totalProfitSinceLastWeek}% since last week`
                            : `${item.totalProfitSinceLastWeek}% since last week`}
                    </CustomText>
                </View>
            </View>
            {/* <View>
                <CustomText category="h6" style={{ color: "#fff" }}>
                    {item.currentPrice.toFixed(2)}
                </CustomText>
                <CustomText
                    category="p2"
                    style={{
                        color: item.finalTotal && item.finalTotal > 0 ? "#008000" : "#ff0000",
                    }}
                >
                    ({item.currentPrice > 0 ? "+" : ""}
                    {item.currentPrice.toFixed(2)}%)
                </CustomText>
            </View> */}
        </View>
    </View>
);

const styles = StyleSheet.create({
    rootContainer: { flexGrow: 1, backgroundColor: "#181921", color: "#fff" },
    search: { flex: 1 },
    userBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginTop: 26,
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
