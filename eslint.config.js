import antfu from '@antfu/eslint-config'

export default antfu({}, {
  rules: {
    // https://github.com/antfu/eslint-config/pull/214
    'node/prefer-global/process': [
      'off',
      'never',
    ],
  },
})
