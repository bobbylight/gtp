module.exports = {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        // Force image to load when appropriate:
        // https://github.com/jsdom/jsdom/issues/1816
        resources: 'usable',
    },
    roots: [
        '<rootDir>/src',
    ],
    testMatch: [
        '**/*.spec.ts',
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
