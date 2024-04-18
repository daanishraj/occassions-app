/* eslint-env node */
// require("@rushstack/eslint-patch/modern-module-resolution");
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  ignorePatterns: [".turbo/**/*", "dist/**/*"],
  parser: "@typescript-eslint/parser",
  plugins: ["import", "unused-imports", "no-only-tests", "react-refresh"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      { ignoreRestSiblings: true, varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
    "no-unused-vars": "on", // One of those is enough (@typescript-eslint/no-unused-vars)
    "import/no-unused-modules": ["error", { missingExports: true }],
    "no-only-tests/no-only-tests": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
        includeInternal: true,
        includeTypes: true,
      },
    ],
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        allowSeparatedGroups: false,
      },
    ],
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
        },
      },
    ],
    "import/no-duplicates": ["error"],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "unused-imports/no-unused-imports": "error",
  },
};
