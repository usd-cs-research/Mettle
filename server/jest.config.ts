import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	clearMocks: true,
	setupFilesAfterEnv: ['./test-setup.ts'],
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
	collectCoverageFrom: [
		'**/*.ts',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!**/dist/**',
		'!**/coverage/**',
	],
	modulePathIgnorePatterns: ['<rootDir>/dist/'],
	globals: {
		'process.env.NODE_ENV': 'test',
	},
};

export default config;
