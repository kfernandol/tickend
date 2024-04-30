import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';

const SSL_PATH = "./ssl/";
const SSL_KEY_NAME = "cert.key";
const SSL_CERT_NAME = "cert.pem";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    preview: {
        host: true,
        strictPort: true,
        port: 8080
    },
    server: {
        proxy: {

        },
        port: 5173,
        https: {
            key: fs.readFileSync(SSL_PATH + SSL_KEY_NAME),
            cert: fs.readFileSync(SSL_PATH + SSL_CERT_NAME),
        }
    }
})
