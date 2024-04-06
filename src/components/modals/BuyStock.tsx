import { BottomSheetView } from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import { CustomButton, CustomText } from "components/UI/CustomElements";
import { ReactElement, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Stock } from "schema/types";
import { LineChart } from "react-native-chart-kit";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import moment from "moment";
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from "react-native-reanimated";
import { useMemo } from "react";
import { t } from "i18next";

interface Props {
    handleCloseModal: () => void;
    stock: Stock | null;
    buyHandler: (amount: number, stock: Stock) => void;
}

export const BuyStock = ({ handleCloseModal, stock, buyHandler }: Props): ReactElement => {
    const [amount, setAmount] = useState(0);

    if (!stock) {
        return <LoadingSpinner />;
    }

    return (
        <BottomSheetView style={styles.modal}>
            <View>
                <CustomText category="h5" className="text-center text-white">
                    {t(`Stock price changes for`).toString()} {stock.companyName.toUpperCase()}
                </CustomText>
                <LineChart
                    data={{
                        labels: stock.priceChanges.map((priceChange) =>
                            moment(new Date(priceChange.date)).format("MMMM"),
                        ),
                        datasets: [
                            {
                                data: stock.priceChanges.map((priceChange) => priceChange.price),
                            },
                        ],
                    }}
                    width={Dimensions.get("window").width - 32} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726",
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
            <View>
                <CustomText className="text-white">{t(`Stocks amount`).toString()}: {amount.toFixed(0)}</CustomText>
                <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={0}
                    maximumValue={20}
                    minimumTrackTintColor="#fff"
                    onValueChange={(val) => setAmount(val)}
                    value={amount}
                />
            </View>
            <View>
                <CustomText category="h3" className="my-2 text-white">
                    {t(`Final price`).toString()}: ${(amount * stock.currentPrice).toFixed(2)}
                </CustomText>
            </View>
            <CustomButton status="info" onPress={() => buyHandler(+amount.toFixed(0), stock)}>
                {t(`Buy stock`).toString()}
            </CustomButton>
        </BottomSheetView>
    );
};

const styles = StyleSheet.create({
    modal: { padding: 16, paddingBottom: 32 },
});
