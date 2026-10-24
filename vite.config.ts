import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const pagesBasePath = process.env.VITE_BASE_PATH;

export default defineConfig({
  base: pagesBasePath ? `${pagesBasePath.replace(/\/+$/, '')}/` : '/',
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
