import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'node_modules/',
      '.features-gen/',
      'test-results/',
      'playwright-report/',
      'blob-report/',
      'allure-results/',
      'allure-report/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // APIResponse.json() is any by design; responses are typed by helper return types instead
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // code rules from the mentor's review
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='expect'][arguments.length<2]",
          message: 'expect needs a message: expect(value, "What should happen")',
        },
        {
          selector:
            "CallExpression[callee.object.name='expect'][callee.property.name='soft'][arguments.length<2]",
          message: 'expect.soft needs a message: expect.soft(value, "What should happen")',
        },
        {
          selector: 'MemberExpression[property.name=/^(waitForURL|waitForResponse)$/]',
          message: 'Check what the user sees, not URLs or responses',
        },
      ],
    },
  },
  {
    files: ['eslint.config.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['app/**/*.ts', 'core/**/*.ts', 'fixtures/**/*.ts', 'tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-skipped-test': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-wait-for-timeout': 'error',
      // helpers that wrap expect
      'playwright/expect-expect': ['error', { assertFunctionNames: ['expectProfile'] }],
    },
  },
  {
    // BDD steps hold expect outside test(); known defects use test.fail() on purpose
    files: ['tests/bdd/steps/**/*.ts'],
    rules: { 'playwright/no-standalone-expect': 'off' },
  },
  prettier,
);
