import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    {
        languageOptions: { globals: globals.node, parser: tsParser },
        plugins: {
            '@typescript-eslint': tseslint,
            prettier: prettier,
            pluginJs,
        },
        rules: {
            'no-undef': 'off',
            ...tseslint.configs.recommended.rules,
            'prettier/prettier': 'error', // Faz Prettier mostrar erros
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            'no-useless-constructor': 'off',
        },
    },
    prettierConfig,
];
