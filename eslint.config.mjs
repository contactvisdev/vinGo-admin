import { fixupConfigRules } from '@eslint/compat';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import unusedImports from 'eslint-plugin-unused-imports';
import js from '@eslint/js';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  js.configs.recommended,
  ...fixupConfigRules(compat.extends('prettier')),

  {
    plugins: {
      prettier,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'unused-imports': unusedImports
    },

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    settings: {
      react: {
        version: 'detect' // ✅ Detect the installed React version
      }
    },

    rules: {
      'no-unused-vars': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-autofocus': 'off',

      'prettier/prettier': [
        'warn',
        {
          bracketSpacing: true,
          printWidth: 140,
          singleQuote: true,
          trailingComma: 'none',
          tabWidth: 2,
          useTabs: false
        }
      ]
    }
  },
  {
    ignores: ['node_modules/**'],
    files: ['src/**/*.{js,jsx}']
  }
];
