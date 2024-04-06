import "dotenv/config";

module.exports = {
    expo: {
        name: "LunaLearn",
        slug: "lunalearn",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/mathify.png",
        userInterfaceStyle: "automatic",
        scheme: "lunalearn",
        notification: {
            androidMode: "default",
            icon: "./assets/mathify_noti_logo.png",
            color: "#FFFFFF",
        },
        plugins: [
            [
                "expo-image-picker",
                {
                    photosPermission:
                        "The app accesses your photos to let you share them with your instructors.",
                },
            ],
            ["expo-localization"],
            [
                "expo-notifications",
                {
                    icon: "./assets/mathify_noti_logo.png",
                    color: "#ffffff",
                },
            ],
            ["expo-apple-authentication"],
            [
                "expo-build-properties",
                {
                    ios: {
                        deploymentTarget: "13.4",
                        useFrameworks: "static",
                    },
                },
            ],

            [
                "expo-location",
                {
                    locationAlwaysAndWhenInUsePermission: "Allow Mathify to use your location.",
                },
            ],
        ],
        splash: {
            image: "./assets/mathify_splash.png",
            resizeMode: "cover",
            backgroundColor: "#000",
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["**/*"],
        ios: {
            supportsTablet: true,
            config: {
                usesNonExemptEncryption: false,
            },
            bundleIdentifier: "com.markocelovsky.lunalearn",
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/mathify.png",
                backgroundColor: "#000",
            },
            config: {
                googleMaps: {
                    apiKey: process.env.MAP_KEY,
                },
            },
            permissions: ["android.permission.RECORD_AUDIO"],
            package: "com.markocelovsky.lunalearn",
            googleServicesFile: "./google-services.json",
        },
        web: {
            favicon: "./assets/mathify.png",
        },
        extra: {
            FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
            FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
            FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
            FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
            FIREBASE_MESSAGE_SENDER_ID: process.env.FIREBASE_MESSAGE_SENDER_ID,
            FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
            FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
            EXPO_PROJECT_ID: process.env.EXPO_PROJECT_ID,
            EXPO_CLIENT_ID: process.env.EXPO_CLIENT_ID,
            IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,
            ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
            MAP_KEY: process.env.MAP_KEY,

            eas: {
                projectId: process.env.EXPO_PROJECT_ID,
            },
        },
        owner: "markocelovsky",
    },
};
