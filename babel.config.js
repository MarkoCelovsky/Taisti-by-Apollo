module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            "nativewind/babel",
            [
                "module:react-native-dotenv",
                {
                    envName: "APP_ENV",
                    moduleName: "@env",
                    path: ".env",
                    safe: false,
                    allowUndefined: false,
                    verbose: false,
                },
            ],
            [
                "react-native-reanimated/plugin",
                {
                    relativeSourceLocation: true,
                },
            ],
            [
                "module-resolver",
                {
                    alias: {
                        components: "./src/components",
                        context: "./src/context",
                        helperFunctions: "./src/helperFunctions",
                        hooks: "./src/hooks",
                        navigation: "./src/navigation",
                        screens: "./src/screens",
                        styles: "./src/styles",
                        schema: "./src/schema",
                        utils: "./src/utils",
                        assets: "./assets",
                    },
                },
            ],
        ],
    };
};
