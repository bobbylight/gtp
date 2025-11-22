export default {
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
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
