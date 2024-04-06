// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import {
    collection,
    CollectionReference,
    DocumentData,
    Firestore,
    getFirestore,
    initializeFirestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {
    Application,
    Conversation,
    Equation,
    Group,
    MessageItem,
    Notification,
    SavedStock,
    User,
} from "schema/types";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};
// Initialize Firebase
let app: FirebaseApp, auth: Auth, db: Firestore;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
    db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
} else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
}
export { app, auth, db };
export const storage = getStorage(app);

export const collectionConverter = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>;
};

export const usersCol = collectionConverter<Omit<User, "userId">>("users");

export const groupsCol = collectionConverter<Omit<Group, "docId">>("groups");

export const stocksCol = (userId: string) =>
    collectionConverter<SavedStock>(`users/${userId}/stocks`);

export const notificationsCol = (groupId: string) =>
    collectionConverter<Omit<Notification, "docId">>(`groups/${groupId}/notifications`);

export const equationsCol = (userId: string) =>
    collectionConverter<Omit<Equation, "docId">>(`users/${userId}/equations`);

export const applicationsCol = (groupId: string) =>
    collectionConverter<Application>(`groups/${groupId}/applications`);

export const conversationsCol =
    collectionConverter<Omit<Conversation, "id" | "messages">>("conversations");

export const messagesCol = (chatId: string) =>
    collectionConverter<MessageItem>(`conversations/${chatId}/messages`);
