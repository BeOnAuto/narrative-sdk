import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest', // Use ts-jest to process TypeScript
    testEnvironment: 'node', // Use Node.js environment
    moduleDirectories: ['node_modules', 'src'], // Resolve imports
    testMatch: ['**/tests/**/*.test.ts', '**/?(*.)+(spec|test).ts'], // Match test files
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // If you use path aliases in tsconfig.json
    },
};

export default config;