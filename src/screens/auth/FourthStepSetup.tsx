import { CustomButton, CustomText } from "components/UI/CustomElements";
import { useAuth } from "context/auth-context";
import { ReactElement } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserTolerance } from "schema/types";

const questions = [
    {
        choices: [
            UserTolerance.VeryCautios,
            UserTolerance.Cautious,
            UserTolerance.Neutral,
            UserTolerance.Aggressive,
            UserTolerance.VeryAggressive,
        ],
    },
];

export const FourthStepSetup = ({ route }: { route: any }): ReactElement => {
    const [selected, setSelected] = useState<UserTolerance>();
    const navigation = useNavigation<any>();
    const { selectedInterest, selectedExperience, selectedBudget } = route.params;

    const next = async () => {
        if (selected !== undefined) {
            navigation.navigate("FifthStepSetup", {
                selectedInterest,
                selectedExperience,
                selectedBudget,
                selectedTolerance: selected,
            });
        }
    };

    const prev = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.rootContainer}>
            <View style={styles.contentContainer}>
                <CustomText style={styles.title}>{`What is your risk tolerance?`}</CustomText>
                <CustomText style={styles.description}>
                    We need to know this for regulatory reasons. And also, we're curious!
                </CustomText>
                <View style={styles.questionContainer}>
                    {questions.map((question, index) => (
                        <FlatList
                            key={index}
                            data={question.choices}
                            numColumns={2}
                            renderItem={({ item }) => (
                                <CustomButton
                                    key={item}
                                    style={[
                                        styles.choiceButton,
                                        {
                                            backgroundColor:
                                                selected === item ? "#4F5355" : "#2D2F30",
                                        },
                                    ]}
                                    onPress={() => setSelected(item)}
                                >
                                    {item}
                                </CustomButton>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ))}
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton onPress={prev} status="info" style={styles.button}>
                    Previous
                </CustomButton>
                <CustomButton onPress={next} status="info" style={styles.button}>
                    Finish
                </CustomButton>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: "#181921",
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: "#4F5355",
        marginBottom: 16,
    },
    questionContainer: {
        marginTop: 16,
    },
    choiceButton: {
        margin: 4,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    button: {
        width: "45%",
    },
});
