import { useCallback } from "react";
import { doc, updateDoc } from "firebase/firestore";

import { User } from "schema/types";
import { db } from "utils/firebase.config";

export const useStudent = () => {
    const assignStudentsToGroup = useCallback(async (studentIds: string[], groupId: string) => {
        try {
            for (let i = 0; i < studentIds.length; i++) {
                await updateDoc(doc(db, `users/${studentIds[i]}`), {
                    groupId,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

    const updateUser = useCallback(async (updatedUser: User) => {
        try {
            await updateDoc(doc(db, `users/${updatedUser.userId}`), updatedUser);
        } catch (err) {
            console.error(err);
        }
    }, []);

    return {
        assignStudentsToGroup,
        updateUser,
    };
};
