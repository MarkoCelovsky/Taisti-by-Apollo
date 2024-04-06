import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { FirebaseError } from "firebase/app";

import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { z, ZodType } from "zod";

import { BottomSwitch } from "components/auth/BottomSwitch";
import { SignIn } from "components/auth/SignIn";
import { SignInInputs } from "components/auth/SignInInputs";
import { SignUp } from "components/auth/SignUp";
import { SignUpInputs } from "components/auth/SignUpInputs";
import { ErrorMessage } from "components/UI/ErrorMessage";
import { KeyboardAvoidingWrapper } from "components/UI/KeyboardAvoidingWrapper";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { blankUser, useAuth } from "context/auth-context";
import { useDeviceToken } from "hooks/useDeviceToken";
import { stylesAuthForms } from "styles/main";
import { SignInFormData, SignUpFormData } from "schema/form-types";
import { AuthMode, NotificationTypes, User, UserRole } from "schema/types";
import { db } from "utils/firebase.config";

WebBrowser.maybeCompleteAuthSession();

const notificationPreferences: Array<NotificationTypes> = [
    NotificationTypes.REMINDER,
    NotificationTypes.CANCELED_EVENT,
    NotificationTypes.LAST_MINUTE_EVENT,
    NotificationTypes.DAILY_PRACTICE,
    NotificationTypes.CHAT_MESSAGE,
];

const signUpSchema: ZodType<SignUpFormData> = z.object({
    firstName: z.string().trim().min(2).max(35),
    lastName: z.string().trim().min(2).max(35),
    email: z.string().trim().email("This is not a valid email."),
    password: z.string().trim().min(6, { message: "Password must be at least 6 characters long" }),
});

const signInSchema: ZodType<SignInFormData> = z.object({
    email: z.string().trim().email("This is not a valid email."),
    password: z.string().trim().min(6, { message: "Password must be at least 6 characters long" }),
});

export const Authenticate = (): ReactElement => {
    const [isLoading, setIsLoading] = useState(false);
    const [authMode, setAuthMode] = useState<AuthMode>("SignIn");
    const [error, setError] = useState<string | null>(null);
    const { signUp, signIn } = useAuth();
    const { deviceToken } = useDeviceToken();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const {
        control: signInControl,
        handleSubmit: signInHandleSubmit,
        formState: { errors: signInErrors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const signInHandler = async (data: SignInFormData) => {
        setIsLoading(true);
        try {
            const { user } = await signIn(data.email.toString(), data.password);
            const currentUser = await getDoc(doc(db, `users/${user.uid}`));
            await AsyncStorage.setItem("userId", user.uid);
            await AsyncStorage.setItem(
                "user",
                JSON.stringify({
                    ...currentUser.data(),
                    userId: user.uid,
                    deviceToken,
                } as User),
            );
            await updateDoc(doc(db, `users/${user.uid}`), {
                deviceToken,
            });
        } catch (err) {
            err instanceof FirebaseError && setError(JSON.stringify(err.code));
            // switch (err.code) {
            //     case "auth/user-not-found":
            //         this.statusMessage.message("Your email address is wrong! please try again");
            //         break;

            //     case "auth/invalid-email":
            //         this.statusMessage.message("You have enterd invalid email address");
            //         break;

            //     case "auth/wrong-password":
            //         this.statusMessage.message("Password you have enterd is wrong");
            //         break;

            //     default:
            //         console.dir(error);
            //         this.statusMessage.message("Something wen wrong! please try again later");
            //         break;
            // }
        } finally {
            setIsLoading(false);
        }
    };

    const signUpHandler = async (data: SignUpFormData) => {
        setIsLoading(true);
        try {
            const { user } = await signUp(data.email.toString(), data.password);
            await AsyncStorage.setItem("userId", user.uid);
            const userData: Omit<User, "userId"> = {
                username: { firstName: data.firstName, lastName: data.lastName },
                fullName: `${data.firstName} ${data.lastName}`,
                email: user.email || "",
                photoURL: blankUser,
                accountFinished: false,
                phoneNumber: null,
                userRole: UserRole.Student,
                deviceToken,
                groupId: null,
                notificationPreferences,
                createdAt: Timestamp.now(),
            };
            await setDoc(doc(db, `users/${user.uid}`), userData);
            await AsyncStorage.setItem(
                "user",
                JSON.stringify({
                    ...userData,
                    userId: user.uid,
                }),
            );
        } catch (err) {
            err instanceof FirebaseError
                ? setError(JSON.stringify(err.message))
                : setError(`${err}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const changeMode = (mode: AuthMode) => {
        setError(null);
        control._reset();
        signInControl._reset();
        setAuthMode(mode);
    };
    return (
        <KeyboardAvoidingWrapper>
            <SafeAreaView style={styles.rootContainer}>
                <View style={styles.authContainer}>
                    {isLoading ? <LoadingSpinner style={stylesAuthForms.loadingSpinner} /> : null}
                    <View className="items-center justify-center">
                        <Image
                            source={require("assets/mathify.png")}
                            resizeMode="stretch"
                            style={styles.logo}
                            alt="Mathify logo"
                            accessibilityIgnoresInvertColors
                        />
                    </View>
                    <View style={styles.formCtr}>
                        {authMode === "SignIn" ? (
                            <SignInInputs control={signInControl} errors={signInErrors} />
                        ) : (
                            <SignUpInputs control={control} errors={errors} />
                        )}
                        {error ? <ErrorMessage error={error} /> : null}
                        {authMode === "SignIn" ? (
                            <SignIn signInHandler={signInHandleSubmit(signInHandler)} />
                        ) : (
                            <SignUp signUpHandler={handleSubmit(signUpHandler)} />
                        )}
                    </View>
                </View>

                <BottomSwitch authMode={authMode} changeMode={changeMode} />
            </SafeAreaView>
        </KeyboardAvoidingWrapper>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1, padding: 4 },
    logo: { height: 124, width: 124, borderRadius: 8 },
    authContainer: { flex: 1, justifyContent: "center" },
    googleButton: { padding: 12, paddingHorizontal: 32 },
    actionButtons: { marginTop: 23 },
    formCtr: { padding: 12 },
    nameContainer: { flexDirection: "row", gap: 12 },
    nameInput: { flex: 1 },
    nameInputRight: { marginLeft: 8 },
    orSeparator: { color: "#838895", textAlign: "center", marginTop: 16 },
    forgottenPassword: { color: "#0D65F2", fontWeight: "600" },
    inputFieldCtr: { flex: 1 },
});
