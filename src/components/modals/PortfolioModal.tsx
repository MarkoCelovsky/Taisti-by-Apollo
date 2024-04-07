import { ReactElement } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text } from "@ui-kitten/components";
import { t } from "i18next";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";

import { CustomText } from "../UI/CustomElements";

// {
//     id: 1,
//     name: "John Doe",
//     totalProfitSinceLastWeek: -0.7,
//     stocks: [
//         {
//             symbol: "AAPL",
//             companyName: "Apple Inc.",
//             currentPrice: 150.0,
//             finalTotal: 0.0,
//         },
//         {
//             symbol: "GOOGL",
//             companyName: "Alphabet Inc.",
//             currentPrice: 2500.0,
//             finalTotal: 0.0,
//         },
//         {
//             symbol: "TSLA",
//             companyName: "Tesla Inc.",
//             currentPrice: 700.0,
//             finalTotal: 0.0,
//         },
//     ],
// },

interface Props {
    portfolio: {
        id: number;
        name: string;
        totalProfitSinceLastWeek: number;
        stocks: {
            symbol: string;
            companyName: string;
            currentPrice: number;
            finalTotal: number;
        }[];
    };
}

export const PortfolioModal = ({ portfolio }: Props): ReactElement => {
    return (
        <BottomSheetView style={styles.modal}>
            <ScrollView style={styles.rootContainer}>
                <CustomText className="mt-4 text-lg font-bold text-white" style={{ fontSize: 24 }}>
                    {portfolio.name}
                </CustomText>
            </ScrollView>
        </BottomSheetView>
    );
};

const styles = StyleSheet.create({
    modal: { padding: 16, paddingBottom: 32, height: "80%" },
    rootContainer: { padding: 16, height: 400 },
    ctr: { marginVertical: 12, gap: 2 },
});
