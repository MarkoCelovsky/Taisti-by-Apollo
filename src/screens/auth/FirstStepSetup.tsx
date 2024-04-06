import { CustomButton, CustomText } from "components/UI/CustomElements";
import { useAuth } from "context/auth-context";
import { ReactElement } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {UserInterest} from "schema/types";

const questions = [
    {
        choices: [
            UserInterest.Learn,
            UserInterest.TrackPortfolio,
            UserInterest.Explore,
            UserInterest.Community,
            UserInterest.Play,
        ],
    },
];

export const FirstStepSetup = (): ReactElement => {
    const [selected, setSelected] = useState<UserInterest>();
    const navigation = useNavigation<any>();

    const next = () => {
        if (selected !== undefined) {
            navigation.navigate("SecondStepSetup", { selectedInterest: selected });
        }
    };

    return (
        <SafeAreaView style={styles.rootContainer}>
            <View style={styles.contentContainer}>
                <CustomText style={styles.title}>{`What are you interested in?`}</CustomText>
                <CustomText style={styles.description}>
                    We need to know this for regulatory reasons. And also, we're curious!
                </CustomText>
                <View style={styles.questionContainer}>
                    {questions.map((question, index) => (
                        <FlatList
                            key={index}
                            data={question.choices}
                            numColumns={1}
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
            <CustomButton onPress={next} status="info">
                Next
            </CustomButton>
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
});
