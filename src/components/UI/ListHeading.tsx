import { ReactElement } from "react";
import { View } from "react-native";
import { ViewStyle } from "react-native-phone-input";
import { t } from "i18next";
import { CustomText } from "./CustomElements";

interface Props {
    navigate?: () => void;
    heading: string;
    style?: ViewStyle;
    showAll?: boolean;
    noTranslate?: boolean;
}
export const ListHeading = ({
    heading,
    navigate,
    style,
    showAll = false,
    noTranslate = false,
}: Props): ReactElement => {
    return (
        <View className="mb-3 flex-row justify-between px-4" style={style}>
            <CustomText className="text-lg font-bold">
                {noTranslate ? heading : t(heading)}
            </CustomText>
            {showAll ? (
                <CustomText className="text-base font-bold text-blue-600" onPress={navigate}>
                    {t("view-all")}
                </CustomText>
            ) : null}
        </View>
    );
};
