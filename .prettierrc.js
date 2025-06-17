export default {
    $schema: 'https://json.schemastore.org/prettierrc',
    arrowParens: 'always',
    bracketSpacing: true,
    endOfLine: 'lf',
    printWidth: 100,
    proseWrap: 'never',
    quoteProps: 'consistent',
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    useTabs: false,
    plugins: ['prettier-plugin-tailwindcss'],
    overrides: [
        {
            files: '*.md',
            options: {
                proseWrap: 'preserve',
            },
        },
    ],
};
