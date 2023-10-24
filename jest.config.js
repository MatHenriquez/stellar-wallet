module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.{ts, tsx}"],
  coverageDirectory: "coverage",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(ts|tsx)$": "babel-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleNameMapper: {
    "^react-dom$": "react-dom/profiling",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
};