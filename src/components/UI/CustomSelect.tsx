import { View } from "react-native";
import { useTheme } from "@ui-kitten/components";
import { CustomText } from "./CustomElements";

interface Props {
    title: string;
    description?: string;
}

export const CustomSelectItem = ({ title, description }: Props) => {
    const theme = useTheme();

    return (
        <View>
            <CustomText category="s1" style={{ color: theme["text-basic-color"] }}>
                {title}
            </CustomText>
            {description ? (
                <CustomText category="c1" style={{ color: theme["text-hint-color"] }}>
                    {description}
                </CustomText>
            ) : null}
        </View>
    );
};
