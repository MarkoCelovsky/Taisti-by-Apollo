import { ReactElement, useCallback, useMemo, useRef, useState } from "react";
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
import {
    entertainmentStocks,
    gastronomyStocks,
    healthcareStocks,
    sportsStocks,
    technologyStocks,
} from "schema/data";
import { BuyStock } from "components/modals/BuyStock";
import { CustomInput } from "components/UI/CustomElements";
import { Screens } from "screens/screen-names";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackNavigatorParamList } from "schema/navigationTypes";

export const PopularMarket = (): ReactElement => {
    const [query, setQuery] = useState("");
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { userId, user } = useAuth();
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

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

    const mergedStocks = useMemo(
        () => [
            ...sportsStocks,
            ...technologyStocks,
            ...gastronomyStocks,
            ...entertainmentStocks,
            ...healthcareStocks,
        ],
        [],
    );

    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();

    const buyStock = async (amount: number, stock: Stock) => {
        try {
            await addDoc(stocksCol(userId || "test"), { ...stock, amount });
            handleCloseModal();
        } catch (error) {
            console.error(error);
        }
    };

    const openStock = (stock: Stock) => {
        setSelectedStock(stock);
        openModalHandler();
    };
    const filteredStocks = useMemo(() => {
        return mergedStocks.filter((stock) =>
            stock.companyName.toLowerCase().includes(query.toLowerCase()),
        );
    }, [mergedStocks, query]);

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
                <CustomInput
                    placeholder="Search"
                    style={styles.search}
                    value={query}
                    onChangeText={(text) => setQuery(text)}
                />
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {filteredStocks.slice(5).map((item) => (
                    <TouchableOpacity
                        key={item.symbol}
                        accessibilityRole="button"
                        activeOpacity={0.5}
                        accessibilityIgnoresInvertColors
                        onPress={() => openStock(item)}
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
                <BuyStock
                    stock={selectedStock}
                    handleCloseModal={handleCloseModal}
                    buyHandler={buyStock}
                />
            </BottomSheetModal>
        </SafeAreaView>
    );
};

const Card = ({ item }: { item: Stock }) => (
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
            <View className="mx-4 flex flex-row gap-4">
                <Image
                    style={{ height: 40, width: 40, maxWidth: 40 }}
                    source={{ uri: item.img }}
                    accessibilityIgnoresInvertColors
                />
                <View>
                    <CustomText category="h6" style={{ color: "#fff" }}>
                        {item.symbol}
                    </CustomText>
                    <CustomText category="p2" style={{ color: "#888" }}>
                        {item.companyName.substring(0, 20)}{" "}
                        {item.companyName.length > 20 ? "..." : ""}
                    </CustomText>
                </View>
            </View>

            <View>
                <CustomText category="h6" style={{ color: "#fff" }}>
                    {item.currentPrice.toFixed(2)}
                </CustomText>
                <CustomText
                    category="p2"
                    style={{
                        color: item.finalTotal && item.finalTotal > 0 ? "#ff00000" : "#008000",
                    }}
                >
                    ({item.currentPrice > 0 ? "+" : ""}
                    {(item.currentPrice / 7.5).toFixed(2)}%)
                </CustomText>
            </View>
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
        paddingBottom: 60,
    },
});
