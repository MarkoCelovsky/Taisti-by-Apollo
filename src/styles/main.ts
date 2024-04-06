import { StyleSheet } from "react-native";

export const stylesMain = StyleSheet.create({
    centered: { textAlign: "center" },
    bold12: {
        fontWeight: "bold",
        fontSize: 12,
    },
    bold14: {
        fontWeight: "bold",
        fontSize: 14,
    },
    bold16: {
        fontWeight: "bold",
        fontSize: 16,
    },
    bold20: {
        fontWeight: "bold",
        fontSize: 20,
    },
    bold22: {
        fontWeight: "bold",
        fontSize: 22,
    },
    h1: {
        marginHorizontal: 20,
        marginVertical: 12,
        fontSize: 24,
        fontWeight: "700",
    },
    h2: {
        marginHorizontal: 16,
        marginVertical: 8,
        fontSize: 22,
        fontWeight: "600",
    },
    h3: {
        marginHorizontal: 16,
        marginVertical: 8,
        fontSize: 20,
        fontWeight: "500",
    },
    h4: {
        marginHorizontal: 16,
        marginVertical: 8,
        fontSize: 18,
        fontWeight: "normal",
    },
    formContainer: {
        padding: 16,
        margin: 16,
        borderRadius: 8,
        backgroundColor: "white",
    },
});

export const stylesRideInfo = StyleSheet.create({
    rideInfo: {
        flex: 1,
        alignItems: "center",
        margin: 8,
        marginTop: 12,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingBottom: 12,
    },
});

export const stylesAuthForms = StyleSheet.create({
    formCtr: {
        padding: 16,
        margin: 16,
        borderRadius: 8,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    inputField: {
        marginVertical: 8,
        paddingTop: 8,
    },
    loadingSpinner: { marginVertical: 8 },
    btn: {
        marginTop: 16,
    },
});

export const stylesShadows = StyleSheet.create({
    shadow2: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 2,
    },
    shadow4: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    shadow5: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    shadow8: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    shadow10: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
});

export const stylesHeadings = StyleSheet.create({
    primary300Centered: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
    primary200Centered: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginVertical: 8,
    },
    primary100Centered: {
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        marginVertical: 4,
    },
});
