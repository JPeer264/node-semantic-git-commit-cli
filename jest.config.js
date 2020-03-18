module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/fixtures/', '/test/'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
