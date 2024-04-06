import { useCallback } from "react";
import { doc, FirestoreError, getDoc } from "firebase/firestore";
import { User } from "schema/types";
import { db } from "utils/firebase.config";

export const useAdmin = () => {
    const getAdmin = useCallback(async (adminId: string) => {
        let admin: User | null = null;
        try {
            const docSnap = await getDoc(doc(db, `users/${adminId}`));
            admin = docSnap.exists() ? ({ ...docSnap.data(), userId: docSnap.id } as User) : null;
        } catch (err) {
            err instanceof FirestoreError && console.error(err.message);
        }
        return admin;
    }, []);

    return {
        getAdmin,
    };
};
