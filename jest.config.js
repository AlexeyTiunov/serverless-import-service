/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  roots: ["./src"],
  preset: "ts-jest",
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};
