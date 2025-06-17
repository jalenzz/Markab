/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-tailwindcss'],
    plugins: ['stylelint-order'],
    rules: {
        'order/properties-alphabetical-order': true,
        'no-empty-source': null,
        'declaration-block-single-line-max-declarations': null,
        'no-duplicate-selectors': null,
        'property-no-vendor-prefix': null,
        'value-no-vendor-prefix': null,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['global'],
            },
        ],
    },

    ignoreFiles: ['dist/**/*', 'node_modules/**/*', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
};
