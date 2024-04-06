import { ReactElement, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { t } from "i18next";

import { EditNameModal } from "components/modals/EditNameModal";
import { EditPhoto } from "components/UI/EditPhoto";
import { ListItem } from "components/UI/ListItem";
import { LoadingSpinner } from "components/UI/LoadingSpinner";
import { useAuth } from "context/auth-context";
import { useChat } from "context/chat-context";
import { Screens } from "screens/screen-names";
import { ChatDetailsType, RootStackNavigatorParamList } from "schema/navigationTypes";
import { UserRole } from "schema/types";
import { db, storage } from "utils/firebase.config";
import { CustomText } from "components/UI/CustomElements";

const options = [
    {
        text: t("See members").toString(),
        screen: Screens.ChatMembers,
    },
];

export const ChatDetails = (): ReactElement => {
    const { user } = useAuth();
    const { params } = useRoute<ChatDetailsType>();
    const [isVisible, setIsVisible] = useState(false);
    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackNavigatorParamList>>();
    const { chat, setChat } = useChat();

    if (!chat) {
        return <LoadingSpinner />;
    }

    const saveImageHandler = async (uri: string) => {
        try {
            const res = await fetch(uri);
            const blob = await res.blob();
            const imageRef = ref(storage, `group-images/${params.chatId}`);
            await uploadBytes(imageRef, blob);
            const imageUrl = await getDownloadURL(imageRef);
            //FIXME: this is not ideal, find if firebase offers a better way
            const index = imageUrl.indexOf("?alt");
            const resizedUrl = imageUrl.slice(0, index) + "_200x200" + imageUrl.slice(index);
            await updateDoc(doc(db, `conversations/${params.chatId}`), { photoURL: resizedUrl });

            setChat((curr) => curr && { ...curr, photoURL: resizedUrl });
        } catch (err) {
            console.error(err);
        }
    };

    const pickImage = async () => {
        try {
            const { assets } = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });
            if (!assets) {
                return null;
            }
            saveImageHandler(assets[0].uri);
        } catch (err) {
            console.error(err);
        }
    };

    const saveGroupNameHandler = async (newName: string) => {
        try {
            newName !== chat.chatName &&
                (await updateDoc(doc(db, `conversations/${params.chatId}`), { chatName: newName }));
            setChat((curr) => curr && { ...curr, chatName: newName });
            setIsVisible(false);
        } catch (err) {
            console.error(err);
        }
    };

    const navigateHandler = () => {
        navigate(Screens.ChatMembers, { chatId: chat.id });
    };

    return (
        <View style={styles.rootContainer}>
            <EditPhoto
                image={chat.photoURL}
                isGroup
                description={t("Change photo for this group").toString()}
                title={t("Change group photo").toString()}
                isStudent={user?.userRole === UserRole.Student}
                pickImage={pickImage}
            />
            <View style={styles.heading}>
                <CustomText
                    category="h3"
                    onPress={() =>
                        user?.userRole !== UserRole.Student && Platform.OS === "ios"
                            ? Alert.prompt(
                                  t("Edit group name").toString(),
                                  "",
                                  saveGroupNameHandler,
                              )
                            : setIsVisible(true)
                    }
                >
                    {chat.chatName}
                </CustomText>
            </View>
            <FlashList
                data={options}
                estimatedItemSize={74}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => <ListItem title={item.text} onPress={navigateHandler} />}
            />
            <EditNameModal
                groupName={chat.chatName || ""}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                onChange={saveGroupNameHandler}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
    listContainer: { paddingHorizontal: 16 },
    heading: { margin: 16, alignItems: "center" },
});
