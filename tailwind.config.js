/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
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
                default: '150ms',
            },

            colors: {
                newtab: {
                    'theme-light': 'rgb(0, 122, 255)',
                    'theme-dark': 'rgb(0, 122, 255)',

                    'text-primary-light': 'rgb(29, 35, 41)',
                    'text-primary-dark': 'rgb(247, 249, 252)',
                    'text-secondary-light': 'rgb(74, 85, 104)',
                    'text-secondary-dark': 'rgb(203, 213, 224)',

                    'bg-light': 'rgb(248, 250, 252)',
                    'bg-dark': 'rgb(32, 33, 36)',

                    'hover-light': 'rgba(59, 130, 246, 0.1)',
                    'hover-dark': 'rgba(59, 130, 246, 0.15)',
                },
            },
        },
    },
    plugins: [],
};
