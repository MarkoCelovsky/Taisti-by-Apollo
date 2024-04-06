module.exports = {
    env: {
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "@react-native-community",
        "plugin:react-native-a11y/all",
        "prettier",
    ],
    overrides: [],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "simple-import-sort"],
    rules: {
        // indent: [
        //     "error",
        //     4,
        //     {
        //         SwitchCase: 1,
        //         ImportDeclaration: 1,
        //         ignoredNodes: ["ObjectExpression"],
        //     },
        // ],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "react/react-in-jsx-scope": "off",
        "react/jsx-indent-props": ["error", 4],
        "@typescript-eslint/no-explicit-any": "warn",
        // "simple-import-sort/imports": [
        //     "error",
        //     {
        //         groups: [
        //             ["^react", "^@?\\w"],
        //             [
        //                 "^components(/.*|$)",
        //                 "^context(/.*|$)",
        //                 "^hooks(/.*|$)",
        //                 "^navigation(/.*|$)",
        //                 "^screens(/.*|$)",
        //                 "^storage(/.*|$)",
        //                 "^styles(/.*|$)",
        //                 "^schema(/.*|$)",
        //                 "^utils(/.*|$)",
        //             ],
        //             ["^\\u0000"],
        //             ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
        //             ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
        //             ["^.+\\.?(css)$"],
        //         ],
        //     },
        // ],
        // "simple-import-sort/exports": "error",
        "max-len": [
            "error",
            100,
            2,
            { ignoreUrls: true, ignoreTemplateLiterals: true, ignoreStrings: true },
        ],
    },
};
