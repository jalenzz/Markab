/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: ['attribute', 'data-theme'],
    theme: {
        extend: {
            fontFamily: {
                primary: 'var(--font-family-primary)',
            },

            fontSize: {
                title: 'var(--font-size-title)',
                body: 'var(--font-size-body)',
            },

            borderRadius: {
                default: '0.5rem',
            },

            transitionDuration: {
                default: '100ms',
            },

            colors: {
                newtab: {
                    'primary': 'var(--color-primary)',

                    'text-primary': 'var(--color-text-primary)',
                    'text-secondary': 'var(--color-text-secondary)',

                    'surface': 'var(--color-surface)',
                    'surface-elevated': 'var(--color-surface-elevated)',
                    'surface-hover': 'var(--color-surface-hover)',

                    'border': 'var(--color-border)',
                },
            },
        },
    },
    plugins: [],
};
