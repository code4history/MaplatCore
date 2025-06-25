// @ts-nocheck // TypeScriptの型チェックを無効化
import js from "@eslint/js";
import * as tseslint from "@typescript-eslint/eslint-plugin";
import * as tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

const config = [
  {
    ignores: ["dist/**", "lib/**", "es5/**", "node_modules/**", "tiles/**", "parts/**", "parts_test/**", "*.js", "*.mjs", "webpack_config/**", "ts_config/**", "jest_config/**", "bin/**"]
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    }
  },
  
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...js.configs.recommended,
    rules: {
      'no-unused-vars': 'off',
    }
  },
  
  {
    files: ["**/*.{ts,tsx,mtsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"]
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "no-case-declarations": "off",
      "no-constant-condition": ["error", { "checkLoops": false }],
      "arrow-body-style": "error",
      "arrow-spacing": "error",
      "generator-star-spacing": "error",
      "no-duplicate-imports": "error",
      "no-useless-computed-key": "error",
      "no-useless-constructor": "error",
      "no-useless-rename": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "prefer-template": "error",
      "rest-spread-spacing": "error",
      "template-curly-spacing": "error",
      "yield-star-spacing": "error"
    }
  },

  prettier,

  {
    ignores: ["dist/**", "node_modules/**", "*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        document: "readonly",
        navigator: "readonly",
        window: "readonly",
        require: "readonly",
        process: "readonly",
        global: "readonly",
        console: "readonly",
        __dirname: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly"
      }
    }
  }
];

export default config;