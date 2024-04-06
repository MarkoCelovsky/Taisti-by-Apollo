import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

interface RoleData {
    email: string;
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}

interface AssignRoleData {
    userId: string;
    role: "INSTRUCTOR";
}

export const assignRoleToUser = functions.https.onCall(async ({ role, userId }: AssignRoleData) => {
    try {
        await admin.auth().setCustomUserClaims(userId, {
            userRole: role,
        });
    } catch (err) {
        return err;
    }
});
