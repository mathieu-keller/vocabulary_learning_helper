module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '\\.(ts|tsx)$': ['ts-jest'],
    ".+\\.(css|styl|less|sass|scss)$": "<rootDir>/node_modules/jest-css-modules-transform"
  },
  coverageDirectory: '<rootDir>/testsResult',
};