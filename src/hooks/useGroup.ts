import { useCallback } from "react";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    FirestoreError,
    getDocs,
    query,
    where,
} from "firebase/firestore";

import { Group, User, UserRole } from "schema/types";
import { db, groupsCol } from "utils/firebase.config";

export const useGroup = () => {
    const getGroupStudents = useCallback(async (groupId: string) => {
        const students: User[] = [];
        try {
            const q = query(
                collection(db, "users"),
                where("userRole", "==", UserRole.Student),
                where("groupId", "==", groupId),
            );
            const docSnap = await getDocs(q);
            docSnap.forEach((document) => {
                const data = document.data() as User;
                students.push({ ...data, userId: document.id });
            });
        } catch (err) {
            err instanceof FirestoreError ? console.error(err.message) : console.error(err);
        }
        return students;
    }, []);

    const createNewGroup = useCallback(async (name: string) => {
        try {
            await addDoc(collection(db, "groups"), {
                name,
                createdAt: new Date().getTime(),
            });
        } catch (err) {
            err instanceof FirestoreError && console.error(err.message);
        }
    }, []);

    const deleteGroup = useCallback(async (groupId: string) => {
        try {
            await deleteDoc(doc(db, `groups/${groupId}`));
        } catch (err) {
            err instanceof FirestoreError && console.error(err.message);
        }
    }, []);

    const getAllGroups = useCallback(async () => {
        const groups: Group[] = [];
        try {
            const docSnap = await getDocs(groupsCol);
            docSnap.forEach((document) => {
                const data = { ...(document.data() as Group), groupId: document.id };
                groups.push(data);
            });
            groups.sort((a, b) =>
                a.createdAt > b.createdAt ? 1 : a.createdAt < b.createdAt ? -1 : 0,
            );
        } catch (err) {
            err instanceof FirestoreError && console.error(err.message);
        }
        return groups;
    }, []);

    return {
        getAllGroups,
        getGroupStudents,
        createNewGroup,
        deleteGroup,
    };
};
