module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  transform: {"\\.(ts|tsx)$": ['ts-jest']},
  coverageDirectory: '<rootDir>/testsResult'
};