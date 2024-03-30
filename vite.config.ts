import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use '$lib/index.scss' as *;`
            },
        },
    },
	build: {
		sourcemap: true
	},
	server: {
		port: 3000,
		open: true,
		host: true
	},
	plugins: [
		sveltekit()
	]
});
