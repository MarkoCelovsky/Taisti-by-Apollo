import { CustomText, CustomInput } from "components/UI/CustomElements";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Platform } from "expo-modules-core";
import { chatbot } from "schema/data";

export const Taisti = () => {
    const [messages, setMessages] = useState<{ id: ""; text: ""; role: "" }>([]);
    const [inputText, setInputText] = useState("");

    const handleSendMessage = () => {
        if (inputText.trim() !== "") {
            const newUserMessage = {
                text: inputText,
                fromUser: true,
                id: Math.random().toString(),
            };
            setMessages([...messages, newUserMessage]);

            const botResponse = chatbot.find((qa) => qa.question === inputText);
            if (botResponse) {
                const newBotMessage = {
                    text: botResponse.response,
                    fromUser: false,
                    id: Math.random().toString(),
                };
                setTimeout(() => {
                    setMessages((prev) => [...prev, newBotMessage]);
                }, 1000);
            } else {
                const newBotMessage = {
                    text: "Sorry, I don't understand that yet.",
                    fromUser: false,
                    id: Math.random().toString(),
                };
                setTimeout(() => {
                    setMessages((prev) => [...prev, newBotMessage]);
                }, 1000);
            }

            // close keyboard
            Keyboard.dismiss();
            setInputText("");
        }
    };

    const renderIconRight = () => (
        <Feather name="send" size={24} color="white" onPress={handleSendMessage} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <CustomText className="mb-4 text-center text-2xl text-white">Taisti AI</CustomText>
            <ScrollView contentContainerStyle={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <View
                        key={index}
                        style={[
                            styles.messageBubble,
                            message.fromUser ? styles.userMessage : styles.botMessage,
                        ]}
                    >
                        <Text style={{ color: "#fff" }}>{message.text}</Text>
                    </View>
                ))}
            </ScrollView>
            <KeyboardAvoidingView
                style={styles.inputContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150}
            >
                <CustomInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type your message..."
                    placeholderTextColor="#fff"
                    accessoryRight={renderIconRight}
                    textStyle={{ color: "#fff" }}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    messagesContainer: {
        flexGrow: 1,
        marginHorizontal: 17,
    },
    messageBubble: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: "80%",
    },
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#4F5355",
        color: "#ffffff",
    },
    botMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#006DFC",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
    },
    input: {
        flex: 1,
        backgroundColor: "#242728",
        color: "#fff",
        borderRadius: 4,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        borderWidth: 0,
    },
});
