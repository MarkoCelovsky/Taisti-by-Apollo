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
import { CustomInput } from "components/UI/CustomElements";
import { GuideModal } from "components/modals/GuideModal";
import { Screens } from "screens/screen-names";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackNavigatorParamList } from "schema/navigationTypes";
import { useEffect } from "react";

const guidesData = [
    {
        id: 1,
        title: "Investing 101: Your Ultimate Beginner's Guide",
        text: "Understanding the Basics: Investing involves committing money to an asset with the expectation of earning a return in the future. Different investments carry varying levels of risk and potential return. Setting Your Financial Goals: Determine if your goals are short-term or long-term. Identify your investment horizon – how long you plan to hold your investments. Educating Yourself: Learn about different investment options, strategies, and terminology. Understand various investment vehicles like stocks, bonds, mutual funds, and ETFs. Starting Small: Open an investment account with a brokerage firm or investment platform. Consider using dollar-cost averaging to invest small amounts regularly. Diversifying Your Portfolio: Spread your investments across different asset classes, industries, and regions. Regularly rebalance your portfolio to maintain your desired asset allocation. Staying Informed and Patient: Stay updated on market trends and economic indicators. Be patient and avoid reacting emotionally to market fluctuations. Seeking Professional Advice if Needed: Consider consulting a financial advisor for personalized advice. Remember, investing involves risk, and it's essential to stay disciplined and focused on your long-term financial goals.",
        img: "https://www.centralbank.net/globalassets/images/articles/lc-the-basics-of-investing.jpg?v=1D833C6DFE07500",
    },
    {
        id: 2,
        title: "Demystifying Investments",
        text: "Investments can often seem complex or mysterious to those who aren't familiar with them. At its core, however, investing is simply putting money into assets with the expectation of generating a return or profit over time. Here's a breakdown to demystify investments: Purpose: Investments serve various purposes, such as wealth accumulation, income generation, or funding future goals like retirement or education. Risk and Return: There's a fundamental relationship between risk and return in investments. Generally, higher returns are associated with higher risk. Understanding your risk tolerance is crucial in deciding where to invest. Types of Investments: Stocks: Ownership in a company, providing potential for capital appreciation and dividends. Bonds: Loans to governments or corporations, offering regular interest payments and return of principal at maturity. Real Estate: Ownership of physical properties, offering potential for rental income and property appreciation. Mutual Funds/ETFs: Pooled funds from multiple investors, managed by professionals, offering diversification across various assets. Commodities: Physical goods like gold, oil, or agricultural products, often used as hedges against inflation. Cryptocurrencies: Digital assets with decentralized control, offering potential for high returns but also high volatility. Diversification: Spreading investments across different asset classes and securities helps reduce overall risk. Diversification can be achieved within asset classes, sectors, geographical regions, etc. Time Horizon: Your investment time horizon, whether short-term or long-term, influences your investment choices and strategies. Longer time horizons generally allow for more aggressive strategies. Costs and Fees: Understand the costs associated with investing, including brokerage fees, management fees for mutual funds or ETFs, and taxes. Minimizing costs can significantly impact your overall returns. Research and Due Diligence: Conduct thorough research before making investment decisions. This includes understanding the fundamentals of the assets you're investing in, as well as external factors like economic indicators and market trends. Emotional Discipline: Emotional reactions to market fluctuations can lead to poor investment decisions. Having a disciplined approach and sticking to your investment plan, especially during turbulent times, is crucial. Rebalancing: Regularly review and adjust your investment portfolio to maintain alignment with your financial goals and risk tolerance. Rebalancing involves selling assets that have performed well and buying those that are underperforming to maintain desired asset allocations. Seek Professional Advice When Needed: If you're unsure about investing or need guidance, consider consulting a financial advisor who can provide personalized advice based on your financial situation, goals, and risk tolerance. By understanding these key principles, you can demystify investments and make more informed decisions to achieve your financial objectives.",
        img: "https://media.gq-magazine.co.uk/photos/5e25d00550c26e0008a9b030/master/pass/20200120-invest.jpg",
    },
];

export const Learning = (): ReactElement => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { userId, user } = useAuth();
    const [guides, setGuides] = useState<any[]>(guidesData);
    const [selectedGuide, setSelectedGuide] = useState<{
        title: string;
        text: string;
        img: string;
    }>({
        title: "",
        text: "",
        img: "",
    });
    const [search, setSearch] = useState("");

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

    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();

    useEffect(() => {
        setGuides(guidesData);
        const filter = guidesData.filter((guide) =>
            guide.title.toLowerCase().startsWith(search.toLowerCase()),
        );
        setGuides(filter);
    }, [search]);

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
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />
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
        paddingTop: 8,
    },
});
