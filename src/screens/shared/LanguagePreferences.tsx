import { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "i18next";
import moment from "moment";

import { CustomButton, CustomText } from "components/UI/CustomElements";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { RadioOption } from "components/UI/RadioOption";

import "moment/min/locales";

const languages = [
    { language: "English", code: "en" },
    { language: "Slovenský", code: "sk" },
    { language: "Español", code: "es" },
];

export const LanguagePreferences = (): ReactElement => {
    const [selected, setSelected] = useState(languages[0].code);
    const [isLoading, setIsLoading] = useState(true);
    const { i18n } = useTranslation();

    const saveChangesHandler = async () => {
        setIsLoading(true);
        moment.locale(selected);
        await i18n.changeLanguage(selected);
        await AsyncStorage.setItem("lng", selected);
        setIsLoading(false);
    };

    useEffect(() => {
        const getLanguage = async () => {
            try {
                const lng = await AsyncStorage.getItem("lng");
                lng && setSelected(lng);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        getLanguage();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (
        <View style={styles.rootContainer}>
            <View style={styles.container}>
                <CustomText category="h5">{t("Select your language")}</CustomText>
                <FlatList
                    data={languages}
                    contentContainerStyle={styles.radioContainer}
                    renderItem={({ item }) => (
                        <RadioOption
                            key={item.code}
                            id={item.code}
                            title={item.language}
                            isSelected={selected === item.code}
                            onPress={(lCode) => setSelected(lCode)}
                        />
                    )}
                />
            </View>
            <CustomButton onPress={saveChangesHandler}>{t("Save changes").toString()}</CustomButton>
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1, padding: 16 },
    container: { flex: 1 },
    radioContainer: { gap: 6, marginTop: 12 },
});
