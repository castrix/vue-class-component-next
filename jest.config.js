const isBabel = !!process.env.BABEL_TEST

const tsJestConfig = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'test/tsconfig.json',
    }],
  },
}

const babelJestConfig = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[t|j]sx?$': ['babel-jest', { configFile: './test/babel.config.js' }],
  },
}

module.exports = {
  ...(isBabel ? babelJestConfig : tsJestConfig),

  testMatch: ['**/test/**/?(*.)+(spec|test).[jt]s?(x)'],

  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.cjs.prod.js',
  },
}
