import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import {
    BottomSheetBackdrop,
    BottomSheetBackgroundProps,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { t } from "i18next";

import { ListHeading } from "components/UI/ListHeading";
import { CustomButton, CustomText } from "components/UI/CustomElements";
import { Equation } from "schema/types";
import { EmptyList } from "components/UI/EmptyList";

export const MyEquations = (): ReactElement => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [equations, setEquations] = useState<Equation[]>([]);

    const openModalHandler = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleCloseModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackgroundProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        ),
        [],
    );

    useEffect(() => {
        (async () => {
            try {
                setEquations([]);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    const selectLessonHandler = () => {
        openModalHandler();
    };

    const succesfullEquations = {
        title: "succesfull-equations",
        data: equations.filter((eq) => eq.succesful),
    };

    const failedEquations = {
        title: "unsuccesfull-equations",
        data: equations.filter((eq) => !eq.succesful),
    };

    const allLessons = [
        ...(succesfullEquations.data.length > 0
            ? [succesfullEquations.title, ...succesfullEquations.data]
            : []),
        ...(failedEquations.data.length > 0
            ? [failedEquations.title, ...failedEquations.data]
            : []),
    ];

    return (
        <View style={styles.rootContainer}>
            <>
                {!allLessons.length ? (
                    <View className="flex-1 items-center justify-center gap-4">
                        <EmptyList />
                        <CustomText className="my-5 text-center text-lg text-white">
                            {t("You have got no assets!")}
                        </CustomText>
                    </View>
                ) : (
                    <FlashList
                        data={allLessons}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={false} />}
                        estimatedItemSize={200}
                        getItemType={(item) => typeof item}
                        renderItem={({ item }) => {
                            if (typeof item === "string") {
                                return <ListHeading heading={item} />;
                            } else {
                                return <View />;
                            }
                        }}
                    />
                )}
            </>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                enableDynamicSizing
                onDismiss={handleCloseModal}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView style={styles.modal}>
                    <CustomButton onPress={handleCloseModal}>Close</CustomButton>
                    <CustomButton onPress={handleCloseModal}>Do something</CustomButton>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
    modal: { padding: 16 },
    sectionContainer: { marginHorizontal: 16 },
});
