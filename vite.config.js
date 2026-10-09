import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import flowbiteReact from 'flowbite-react/plugin/vite';
import seoHtmlPlugin from './seo-html-plugin.js';

// https://vite.dev/config/
export default defineConfig({
	// optimizeDeps: {
	// 	exclude: ['lightningcss'],
	// },
	plugins: [react(), tailwindcss(), flowbiteReact(), seoHtmlPlugin()],
});
