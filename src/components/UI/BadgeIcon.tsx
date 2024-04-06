import { ReactNode } from "react";
import { View } from "react-native";
import { CustomText } from "./CustomElements";

interface Props {
    badgeCount?: number;
    children: ReactNode;
}

const BadgeIcon = ({ badgeCount, children }: Props) => {
    return (
        <View>
            {children}
            {badgeCount && badgeCount > 0 ? (
                <View className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
                    <CustomText className="text-xs font-bold text-white">
                        {badgeCount > 9 ? "9+" : badgeCount}
                    </CustomText>
                </View>
            ) : null}
        </View>
    );
};

export default BadgeIcon;
