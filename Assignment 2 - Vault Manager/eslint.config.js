import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{js,jsx}"],
        extends: [
            js.configs.recommended,
            reactHooks.configs["recommended-latest"],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "no-useless-escape": "off",
        },

        plugins: {
            react: reactPlugin,
            // ... other plugins
        },

        settings: {
            react: {
                version: "detect", // Automatically detects the React version
            },
        },
    },
]);
