import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

export default tseslint.config(
  { ignores: ['dist', 'src/__generated__', 'codegen.ts', 'vite.config.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
    },
    settings: { react: { version: '18.3' } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      "semi": [
        2,
        "always"
      ],
      "semi-spacing": [
        2,
        {
          "before": false,
          "after": true
        }
      ],
      "quote-props": [
        2,
        "as-needed"
      ],
      "quotes": [
        2,
        "single",
        "avoid-escape"
      ],
      "jsx-quotes": [
        2,
        "prefer-single"
      ],
      "no-console": 2,
      "no-irregular-whitespace": 2,
      "no-mixed-spaces-and-tabs": 2,
      "no-multi-spaces": [
        2,
        {
          "exceptions": {
            "Property": false
          }
        }
      ],
      "no-trailing-spaces": [
        2,
        {
          "skipBlankLines": false
        }
      ],
      "indent": [
        2,
        4,
        {
          "SwitchCase": 0
        }
      ],
      "react/jsx-indent": [
        2,
        4
      ],
      "react/jsx-indent-props": [
        2,
        4
      ],
    },
  },
)
