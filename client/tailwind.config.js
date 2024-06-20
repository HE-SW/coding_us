/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                dark: {
                    50: '#b2c0cc',
                    100: '#737680',
                    200: '#4e5058',
                    300: '#44464e',
                    400: '#3a3c44',
                    500: '#30323a',
                    600: '#262830',
                    700: '#1c1e26',
                    800: '#12141c',
                    900: '#080a12',
                },
                main: {
                    background: '#313338',
                    secondary: '#717ba3',
                    success: '#3dd44c',
                    warning: '#fd6546',
                    danger: '#fc2929',
                },
                user: {
                    1: '#a393eb',
                    3: '#612c83',
                    4: '#a96851',
                    5: '#fbfad3',
                    6: '#c6e377',
                    7: '#ffded5',
                    9: '#61f2f5',
                    10: '#36622b',
                    11: '#729d39',
                    12: '#2185d5',
                    13: '#0d63a5',
                    14: '#ffd717',
                    15: '#f6a2d4',
                    16: '#df3554',
                },
            },
        },
    },
    plugins: [],
};
