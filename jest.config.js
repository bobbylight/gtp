module.exports = {
    testEnvironment: 'jsdom',
    roots: [
        '<rootDir>/src'
    ],
    testMatch: [
        '**/*.spec.ts'
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    }
};
