/* eslint-disable no-undef */
module.exports = {
    preset: "ts-jest",
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    setupFilesAfterEnv: ["<rootDir>/tests/setup-jest.ts"],
  };
  