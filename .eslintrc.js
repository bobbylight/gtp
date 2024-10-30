module.exports = {
    env: {
        browser: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        '@stylistic',
    ],
    rules: {
        'no-duplicate-imports': 1,
        quotes: 'off', // Replaced by TypeScript-equivalent rule
        '@typescript-eslint/adjacent-overload-signatures': 0,
        '@typescript-eslint/array-type': [ 'error', { default: 'array' } ],
        '@typescript-eslint/ban-types': 0, // We use 'Function'
        //'@typescript-eslint/brace-style': [ 'error', 'stroustrup' ],
        '@typescript-eslint/class-literal-property-style': 1,
        '@typescript-eslint/consistent-type-definitions': [ 'error', 'interface' ],
        '@typescript-eslint/explicit-module-boundary-types': 0,
        //'@typescript-eslint/indent': [ 'error', 'tab' ], // Broken rule - see doc
        '@typescript-eslint/lines-between-class-members': 0, // fields are OK
        '@typescript-eslint/no-confusing-non-null-assertion': 1,
        '@typescript-eslint/no-confusing-void-expression': 1,
        '@typescript-eslint/no-dynamic-delete': 0, // TODO: enable
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-extraneous-class': 0, // TODO
        '@typescript-eslint/no-inferrable-types': 0,
        '@typescript-eslint/no-invalid-void-type': 1,
        '@typescript-eslint/no-meaningless-void-operator': 1,
        '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 1,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-redundant-type-constituents': 1,
        '@typescript-eslint/no-require-imports': 1,
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 1,
        '@typescript-eslint/no-unnecessary-condition': 0, // TODO: Implement me
        '@typescript-eslint/no-unnecessary-qualifier': 1,
        '@typescript-eslint/no-unnecessary-type-arguments': 1,
        '@typescript-eslint/no-unnecessary-type-assertion': 1,
        '@typescript-eslint/no-unnecessary-type-constraint': 1,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-var-requires': 1,
        '@typescript-eslint/non-nullable-type-assertion-style': 1,
        '@typescript-eslint/prefer-as-const': 1,
        '@typescript-eslint/prefer-nullish-coalescing': 1,
        '@typescript-eslint/prefer-optional-chain': 1,
        '@typescript-eslint/prefer-readonly': 1,
        '@typescript-eslint/prefer-reduce-type-parameter': 1,
        '@typescript-eslint/prefer-regexp-exec': 1,
        '@typescript-eslint/prefer-return-this-type': 1,
        '@typescript-eslint/prefer-string-starts-ends-with': 1,
        '@typescript-eslint/require-await': 1,
        '@typescript-eslint/restrict-plus-operands': 0, // TODO: Implement
        '@typescript-eslint/typedef': 1,
        '@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
        '@stylistic/comma-spacing': 1,
        '@stylistic/keyword-spacing': 1,
        '@stylistic/member-delimiter-style': [ 'error' ],
        '@stylistic/no-extra-semi': 1,
        '@stylistic/quotes': [ 'error', 'single' ],
        '@stylistic/type-annotation-spacing': 1,
    },
};
