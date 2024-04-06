import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";

import { UserCard } from "components/UI/UserCard";
import { Screens } from "screens/screen-names";
import { InstructorsType, RootStackNavigatorParamList } from "schema/navigationTypes";
import { CustomText } from "components/UI/CustomElements";

export const Instructors = (): ReactElement => {
    const {
        params: { name, id, instructors },
    } = useRoute<InstructorsType>();
    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();
    return (
        <View style={styles.rootContainer}>
            <View className="mt-1 ml-4">
                <CustomText category="h3">{name}</CustomText>
            </View>
            <View style={styles.listCtr}>
                <FlashList
                    data={instructors}
                    renderItem={({ item }) => (
                        <UserCard
                            user={item}
                            fullSpace
                            onPress={() =>
                                navigate(Screens.InstructorProfile, {
                                    instructorId: item.userId,
                                    drivingSchoolId: id,
                                })
                            }
                        />
                    )}
                    estimatedItemSize={177}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1, paddingVertical: 16 },
    listCtr: { flex: 1 },
});
