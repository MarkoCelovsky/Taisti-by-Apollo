import { ReactElement, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { FirebaseError } from "firebase/app";
import {
    getAdditionalUserInfo,
    GoogleAuthProvider,
    OAuthCredential,
    OAuthProvider,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc } from "firebase/firestore";
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
import {
    AuthMode,
    GoogleUserFromJWTPayload,
    NotificationTypes,
    User,
    UserRole,
} from "schema/types";
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
    const { signUp, signIn, authenticateWithCredential } = useAuth();
    const { deviceToken } = useDeviceToken();
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.ANDROID_CLIENT_ID,
        expoClientId: process.env.EXPO_CLIENT_ID,
        iosClientId: process.env.IOS_CLIENT_ID,
        scopes: ["profile", "email"],
    });

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

    const getUserInfo = useCallback(async (accessToken: string) => {
        try {
            const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (res.ok) {
                return (await res.json()) as GoogleUserFromJWTPayload;
            }
            return null;
        } catch (err) {
            console.error(err);
            return null;
        }
    }, []);

    const continueWithGoogleHandler = useCallback(
        async (credential: OAuthCredential) => {
            setIsLoading(true);
            try {
                const { user } = await authenticateWithCredential(credential);
                const currentUser = await getDoc(doc(db, `users/${user.uid}`));
                if (currentUser.exists()) {
                    await updateDoc(doc(db, `users/${user.uid}`), {
                        deviceToken,
                    });
                    await AsyncStorage.setItem("userId", user.uid);
                    await AsyncStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...currentUser.data(),
                            userId: user.uid,
                            deviceToken,
                        } as User),
                    );
                } else {
                    const userInfo =
                        !!credential.accessToken && (await getUserInfo(credential.accessToken));
                    //TODO: when creating doc, download the image and upload it to the bucket.
                    const userData = {
                        username: userInfo
                            ? {
                                  firstName: userInfo.given_name ? userInfo.given_name : "",
                                  lastName: userInfo.family_name ? userInfo.family_name : "",
                              }
                            : null,
                        email: user.email,
                        fullName: userInfo ? userInfo.name : "",
                        photoURL: userInfo ? userInfo.picture : blankUser,
                        phoneNumber: null,
                        userRole: UserRole.Student,
                        deviceToken,
                        places: [],
                        drivingSchoolId: null,
                        groupId: null,
                        placesAllowed: true,
                        notificationPreferences,
                        createdAt: serverTimestamp(),
                    } as Omit<User, "userId" | "createdAt">;
                    await AsyncStorage.setItem("userId", user.uid);
                    await AsyncStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...userData,
                            userId: user.uid,
                            deviceToken,
                        }),
                    );
                    await setDoc(doc(db, `users/${user.uid}`), userData);
                }

                credential.accessToken &&
                    (await SecureStore.setItemAsync("accessToken", credential.accessToken));
            } catch (err) {
                const catchedError = err as Error;
                setError(catchedError.message);
                console.error(err);
                //create switch for different login errors and adjust error messages :D thx
            } finally {
                setIsLoading(false);
            }
        },
        [authenticateWithCredential, deviceToken, getUserInfo],
    );
    useEffect(() => {
        if (response?.type === "success") {
            const credential = GoogleAuthProvider.credential(
                null,
                response.authentication?.accessToken,
            );
            continueWithGoogleHandler(credential);
            //TODO: add some error handling for a case when the accessToken is not defined
        }
    }, [response, continueWithGoogleHandler]);

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

    const signInWithApple = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            const provider = new OAuthProvider("apple.com");
            const userCredential = provider.credential({
                idToken: credential.identityToken ? credential.identityToken : "",
            });
            const res = await authenticateWithCredential(userCredential);
            const userInfo = getAdditionalUserInfo(res);
            const currentUser = await getDoc(doc(db, `users/${res.user.uid}`));

            if (!userInfo?.isNewUser) {
                await updateDoc(doc(db, `users/${res.user.uid}`), {
                    deviceToken,
                });
                await AsyncStorage.setItem("userId", res.user.uid);
                await AsyncStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...currentUser.data(),
                        userId: res.user.uid,
                        deviceToken,
                    } as User),
                );
            }
        } catch (err) {
            console.log(err);
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
                            <SignIn
                                promptAsync={promptAsync}
                                request={request}
                                signInHandler={signInHandleSubmit(signInHandler)}
                                signInWithApple={signInWithApple}
                            />
                        ) : (
                            <SignUp
                                promptAsync={promptAsync}
                                request={request}
                                signUpHandler={handleSubmit(signUpHandler)}
                                signInWithApple={signInWithApple}
                            />
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
