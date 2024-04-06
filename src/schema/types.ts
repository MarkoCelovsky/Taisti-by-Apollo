import { DocumentReference, Timestamp } from "firebase/firestore";

export type User = {
    userId: string;
    deviceToken: string | null;
    email: string;
    username: { firstName: string; lastName: string };
    fullName: string;
    userRole: UserRole;
    phoneNumber: string | null;
    photoURL: string | null;
    groupId: string | null;
    accountFinished: boolean;
    notificationPreferences: Array<NotificationTypes>;
    createdAt: Timestamp;
    userPreference: UserPreference;
};

export enum UserPreference {
    Sports = "Sports",
    Gastronomy = "Gastronomy",
    Healthcare = "Healthcare",
    Entertainment = "Entertainment",
    Technology = "Technology", // Add two more preferences here (e.g., 'Entertainment', 'Healthcare')
}

type PriceChange = {
    date: number; // Date of the price change (e.g., YYYY-MM-DD)
    price: number; // Price on that date
    change: number; // Change in price compared to the previous day
    changePercent: number; // Percentage change in price compared to the previous day
};

export type Stock = {
    symbol: string;
    companyName: string;
    finalTotal?: number;
    currentPrice: number;
    userPreference?: UserPreference; // Optional: User preference category for the stock
    priceChanges: PriceChange[]; // Array of price changes for the past few days
};

export interface SavedStock extends Stock {
    docId: string;
    amount: number;
}

export type Group = { createdAt: number; name: string; docId: string };

export interface Equation {
    docId: string;
    equation: string; // The mathematical expression of the equation
    variables: string[]; // List of variables used in the equation
    createdAt: Timestamp; // Timestamp when the equation was created
    authorId: string; // ID of the user who created the equation
    lastModifiedAt: Timestamp; // Timestamp when the equation was last modified
    description?: string; // Description or notes about the equation (optional)
    isPublic: boolean;
    succesful: boolean;
}

export interface GroupWithStudents extends Group {
    studentsAmount: number;
}

export enum UserRole {
    Student = "STUDENT",
    Admin = "ADMIN",
}

export type AuthMode = "SignIn" | "SignUp";

export type City = { name: string; searchName: string };

export interface Chat {
    id: string;
    users: Record<string, User>;
    chatName?: string;
    photoURL?: string;
}

export interface NotiData {
    message: string;
    to: string[];
    receiverId: string[];
    title: string;
}

export interface MessageItem {
    id: string;
    senderId: string;
    message: string;

    createdAt: Timestamp;
    dayTime: number;
    seenBy: string[];
}

export interface Conversation {
    id: string;
    userIds: DocumentReference<User>[];

    messages: MessageItem[];
    createdAt: Timestamp;
    combinedUserIds: string;
    chatName?: string;
    photoURL?: string;
}

export enum NotificationTypes {
    REMINDER = "REMINDER",
    CANCELED_EVENT = "CANCELED_EVENT",
    LAST_MINUTE_EVENT = "LAST_MINUTE_EVENT",
    DAILY_PRACTICE = "DAILY_PRACTICE",
    CHAT_MESSAGE = "CHAT_MESSAGE",
    NEW_APPLICATION = "NEW_APPLICATION",
}

export interface GoogleUserFromJWTPayload {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    hd: string;
    email: string;
    email_verified: boolean;
    nonce: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    iat: number;
    exp: number;
    jti: string;
}

export interface Range {
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}

export interface TimeRange {
    fromTime: string;
    toTime: string;
}

export interface FilterRange {
    startDate: string;
    endDate: string;
}

export interface ReceiverData {
    tokens: string[];
    ids: string[];
}

export interface Notification {
    createdAt: number;
    message: string;
    title: string;
    receiverId: Array<string>;
    docId: string;
}
export interface Application {
    applicant: {
        userId: string;
        username: string;
        email: string;
        photoURL: string | null;
        phoneNumber: string | null;
    };
    groupId: string;
    status: ApplicationStatus;
    docId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export enum ApplicationStatus {
    pending = "PENDING",
    approved = "APPROVED",
    declined = "DECLINED",
}
