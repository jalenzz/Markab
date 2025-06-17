/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media',
    theme: {
        extend: {
            fontFamily: {
                primary: [
                    'LXGW WenKai Screen R',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'PingFang SC',
                    'Microsoft YaHei',
                    'sans-serif',
                ],
                display: [
                    'LXGW WenKai Screen R',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'PingFang SC',
                    'Microsoft YaHei',
                    'sans-serif',
                ],
            },

            colors: {
                newtab: {
                    'text-primary-light': '#1d2329',
                    'text-primary-dark': '#f7f9fc',
                    'text-secondary-light': '#4a5568',
                    'text-secondary-dark': '#cbd5e0',
                    'text-muted-light': '#718096',
                    'text-muted-dark': '#a0aec0',
                    'accent-primary': '#007aff',

                    'bg-primary-light': '#f8fafc',
                    'bg-primary-dark': '#202124',
                    'bg-surface-light': '#ffffff',
                    'bg-surface-dark': '#1f2937',
                    'bg-drop-indicator': '#60a5fa',
                },
            },
        },
    },
    plugins: [],
};
