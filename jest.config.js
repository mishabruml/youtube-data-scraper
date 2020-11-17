module.exports = {
  roots: [
    '<rootDir>/test'
  ],
  testMatch: [
    '**/*test*/**/*.ts',
    '!**/*test*/helpers.ts'
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90
    }
  }
}
