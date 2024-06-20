import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'process';

const ReactCompilerConfig = {
    /* ... */
};
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
            },
        }),
    ],
    define: {
        global: 'window',
    },
    resolve: {
        alias: {
            process: 'process/browser',
        },
    },
});
