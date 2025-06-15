module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  collectCoverage: true,
  moduleNameMapper: {
    'pdfjs-dist': '<rootDir>/__mocks__/pdfjs-dist.js'
  },
  globals: { 'ts-jest': { tsconfig: 'tsconfig.test.json' } },
  coverageThreshold: { global: { branches: 90, functions: 90, lines: 90, statements: 90 } }
};
