import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoLocalization from "expo-localization";
import * as SplashScreen from "expo-splash-screen";
import {
    Auth,
    createUserWithEmailAndPassword,
    OAuthCredential,
    sendPasswordResetEmail as resetPasswordEmail,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut as signUserOut,
    UserCredential,
} from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable, HttpsCallableResult } from "firebase/functions";
import moment from "moment";
import * as LocalAuthentication from "expo-local-authentication";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { User, UserRole } from "schema/types";
import { auth, db } from "utils/firebase.config";

import "moment/min/locales";

interface AuthProviderProps {
    children?: ReactNode;
}

export interface AuthContextModel {
    auth: Auth;
    userId: string | null;
    user: User | null;
    signIn: (email: string, password: string) => Promise<UserCredential>;
    authenticateWithCredential: (credential: OAuthCredential) => Promise<UserCredential>;
    signUp: (email: string, password: string) => Promise<UserCredential>;
    signOut: () => Promise<void>;
    editUser: (updatedUser: Partial<User>) => Promise<void>;
    addRoleToUser: (email: string, role: UserRole) => Promise<HttpsCallableResult<unknown>>;
    getUserRole: () => Promise<UserRole>;
    sendPasswordResetEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextModel>({} as AuthContextModel);

export const useAuth = (): AuthContextModel => {
    return useContext(AuthContext);
};

export const blankUser =
    "https://cdn-icons-png.flaticon.com/512/727/727399.png?w=740&t=st=1679235854~exp=1679236454~hmac=e41787291c70c67ae281b5c340f32daafd6009a1f4e4584c8bbc71da5f3b3e57";

SplashScreen.preventAutoHideAsync();

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const functions = getFunctions();
    const { i18n } = useTranslation();

    const authenticateAsync = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Authenticate to access secure data",
                cancelLabel: "Cancel",
            });

            if (result.success) {
                console.log("Authentication successful!");
                setAuthenticated(true);
            } else {
                console.log("Authentication failed:", result.error);
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    };

    const signUp = (email: string, password: string): Promise<UserCredential> => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = (email: string, password: string): Promise<UserCredential> => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const authenticateWithCredential = async (
        credential: OAuthCredential,
    ): Promise<UserCredential> => {
        return signInWithCredential(auth, credential);
    };

    const signOut = (): Promise<void> => {
        return signUserOut(auth);
    };

    const sendPasswordResetEmail = (email: string): Promise<void> => {
        return resetPasswordEmail(auth, email);
    };

    const addRoleToUser = (
        email: string,
        role: UserRole,
    ): Promise<HttpsCallableResult<unknown>> => {
        const userRole = httpsCallable(functions, "addRoleToUser");
        return userRole({ email, role });
    };

    const editUser = async (updatedUser: Partial<User>) => {
        try {
            await updateDoc(doc(db, `users/${userId}`), updatedUser);
        } catch (err) {
            console.error(err);
        }
    };

    const getUserRole = async (): Promise<UserRole> => {
        try {
            const idTokenResult = auth.currentUser && (await auth.currentUser.getIdTokenResult());
            //FIXME: when realoading the auth.CurrentUser is null
            // therefore we are not able to get the role
            console.log("userRole: ", idTokenResult && idTokenResult.claims.userRole);
            if (idTokenResult && idTokenResult.claims.userRole === UserRole.Admin) {
                return UserRole.Admin;
            } else {
                return UserRole.Student;
            }
        } catch (err) {
            console.error(err);
            return UserRole.Student;
        }
    };
    useEffect(() => {
        !authenticated && authenticateAsync();
    }, [authenticated]);

    useEffect(() => {
        const saveLanguage = async () => {
            const languageCode = ExpoLocalization.locale.substring(0, 2);
            console.log("getting language code");
            try {
                const exists = await AsyncStorage.getItem("lng");
                if (exists) {
                    await i18n.changeLanguage(exists);
                    moment.locale(exists);
                } else {
                    await i18n.changeLanguage(languageCode);
                    moment.locale(languageCode);
                    await AsyncStorage.setItem("lng", languageCode);
                }
            } catch (err) {
                console.error(err);
            }
        };
        saveLanguage();
    }, [i18n]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (!authUser) {
                const cachedUserId = await AsyncStorage.getItem("userId");
                if (cachedUserId) {
                    setUserId(cachedUserId);
                } else {
                    setUserId(null);
                    setUser(null);
                    setIsLoading(false);
                }
                return;
            }
            setUserId(authUser.uid);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const userDocRef = doc(db, `users/${userId}`);
        const unsubscribeSnapshot = onSnapshot(userDocRef, async (userDoc) => {
            try {
                const role = await getUserRole();
                if (userDoc.exists()) {
                    setUser({
                        ...userDoc.data(),
                        userId: userDoc.id,
                        userRole: role,
                    } as User);
                    setIsLoading(false);
                } else {
                    const cachedCurrentUser = await AsyncStorage.getItem("user");
                    setIsLoading(false);
                    if (cachedCurrentUser) {
                        // setUserId(JSON.parse(cachedCurrentUser).userId);
                        return setUser(JSON.parse(cachedCurrentUser));
                    }
                    setUser(null);
                    // setUserId(null);
                }
            } catch (error) {
                console.error(error);
                const cachedCurrentUser = await AsyncStorage.getItem("user");
                setIsLoading(false);
                if (cachedCurrentUser) {
                    // setUserId(JSON.parse(cachedCurrentUser).userId);
                    return setUser(JSON.parse(cachedCurrentUser));
                }
                // setUserId(null);
                setUser(null);
            }
        });

        return () => unsubscribeSnapshot();
    }, [userId]);

    const onLayoutRootView = useCallback(async () => {
        if (!isLoading) {
            console.log("hiding splash screen");
            await SplashScreen.hideAsync();
        }
    }, [isLoading]);

    const values: AuthContextModel = {
        userId,
        user,
        auth,
        signUp,
        signIn,
        authenticateWithCredential,
        signOut,
        sendPasswordResetEmail,
        addRoleToUser,
        getUserRole,
        editUser,
    };

    console.log(!!userId, !!user, isLoading);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    // return all loadings to be the same style component
    return (
        <AuthContext.Provider value={values}>
            <View style={styles.rootContainer} onLayout={onLayoutRootView}>
                {children}
            </View>
        </AuthContext.Provider>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
});
