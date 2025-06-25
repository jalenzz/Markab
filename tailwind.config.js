/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media',
    theme: {
        extend: {
            fontFamily: {
                primary: [
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'PingFang SC',
                    'Microsoft YaHei',
                    'sans-serif',
                ],
            },

            fontSize: {
                title: '1.25rem',
                body: '0.875rem',
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
