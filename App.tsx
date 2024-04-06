import { ReactElement } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as eva from "@eva-design/eva";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { ApplicationProvider } from "@ui-kitten/components";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { default as theme } from "styles/mathify-theme.json";

import { CustomToast } from "components/CustomToast";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { AuthProvider } from "context/auth-context";
import { ChatProvider } from "context/chat-context";
import { BottomTabNavigation } from "navigation/BottomTabNavigation";

const App = (): ReactElement => {
    const [fontsLoaded] = useFonts({
        "Inter-Regular": require("assets/fonts/Inter-Regular.ttf"),
        "RobotoFlex-Regular": require("assets/fonts/RobotoFlex-Regular.ttf"),
    });
    if (!fontsLoaded) {
        return <LoadingSpinner />;
    }
    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: "white",
        },
        text: {
            fontFamily: "RobotoFlex-Regular",
        },
    };

    return (
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
            <SafeAreaView style={styles.rootContainer}>
                <GestureHandlerRootView style={styles.rootContainer}>
                    <AuthProvider>
                        <NavigationContainer theme={MyTheme}>
                            <ChatProvider>
                                <BottomSheetModalProvider>
                                    <StatusBar style="dark" />
                                    <BottomTabNavigation />
                                </BottomSheetModalProvider>
                            </ChatProvider>
                        </NavigationContainer>
                        <CustomToast />
                    </AuthProvider>
                </GestureHandlerRootView>
            </SafeAreaView>
        </ApplicationProvider>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
});

export default App;
