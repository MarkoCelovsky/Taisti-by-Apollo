import { Dispatch, ReactElement, SetStateAction } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RangeDatepicker } from "@ui-kitten/components";
import { t } from "i18next";

import { Range } from "schema/types";

interface Props {
    range: Range;
    setRange: Dispatch<SetStateAction<Range>>;
}

const renderCalenderIcon = () => <Ionicons name="calendar" size={24} color="black" />;

export const CustomDatePickers = ({ range, setRange }: Props): ReactElement => {
    return (
        <View style={styles.rootContainer}>
            <RangeDatepicker
                label={t("From").toString()}
                range={range}
                onSelect={(selectedRange) => setRange(selectedRange)}
                min={new Date()}
                max={new Date(new Date().getTime() + 31556952000)}
                style={styles.viewContainer}
                accessoryLeft={renderCalenderIcon}
                placeholder={t("From").toString()}
                boundingMonth={true}
                backdropStyle={styles.backdrop}
            />
            <RangeDatepicker
                label={t("To").toString()}
                range={range}
                onSelect={(selectedRange) => setRange(selectedRange)}
                min={new Date()}
                max={new Date(new Date().getTime() + 31556952000)}
                style={styles.viewContainer}
                accessoryLeft={renderCalenderIcon}
                placeholder={t("To").toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: { opacity: 0 },
    rootContainer: { flex: 1, marginVertical: 16 },
    backdrop: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
});
