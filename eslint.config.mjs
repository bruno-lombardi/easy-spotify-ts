import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['dist/**', 'examples/dist/**', 'node_modules/**', 'coverage/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      // Existing API models still use untyped Spotify payloads.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' }
      ],
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
]
