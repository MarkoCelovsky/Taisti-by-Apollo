import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { User } from "schema/types";

export type ProfileNavigationParamList = {
    EditProfile: undefined;
    EditInstructorProfile: undefined;
    ResolveApplications: undefined;
    LanguagePreferences: undefined;
    NotificationPreferences: undefined;
};

export type RootStackNavigatorParamList = {
    EditProfile: undefined;
    ResolveApplications: undefined;

    Setup: undefined;
    Learning: undefined;
    NestedSetup: undefined;
    Authenticate: undefined;
    FirstStepSetup: undefined;
    SecondStepSetup: undefined;
    ThirdStepSetup: undefined;
    FourthStepSetup: undefined;
    NestedAuthenticate: undefined;
    NestedDashboard: undefined;
    Dashboard: undefined;
    Profile: undefined;
    NestedProfile: undefined;
    PasswordReset: undefined;
    Manage: undefined;
    NestedAdminDashboard: undefined;
    AdminDashboard: undefined;
    Notifications: undefined;
    PopularMarket: undefined;
    LanguagePreferences: undefined;
    NotificationPreferences: undefined;
    NewEquation: undefined;
    MyEquations: undefined;

    Chat: { user: User | null; chatId: string; userIds: string[] };
    ChatDetails: { chatId: string };
    ChatMembers: { chatId: string };
    TempChat: { user: User };
    StudentProfile: { student: User };
    GroupProfile: { groupData: { id: string; name: string } };
    GroupStudents: { groupId: string; groupName: string };
};

export type ChatType = RouteProp<RootStackNavigatorParamList, "Chat">;

export type ChatDetailsType = RouteProp<RootStackNavigatorParamList, "ChatDetails">;

export type ChatMembersType = RouteProp<RootStackNavigatorParamList, "ChatMembers">;

export type TempChatType = RouteProp<RootStackNavigatorParamList, "TempChat">;

export type StudentProfileType = RouteProp<RootStackNavigatorParamList, "StudentProfile">;

export type GroupProfileType = RouteProp<RootStackNavigatorParamList, "GroupProfile">;

export type MessageNavProps<T extends keyof RootStackNavigatorParamList> = {
    navigation: NativeStackNavigationProp<RootStackNavigatorParamList, T>;
    route: RouteProp<RootStackNavigatorParamList, T>;
};
