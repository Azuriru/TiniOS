import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		sourcemap: true
	},
	server: {
		port: 3000,
		open: true,
	},
	plugins: [
		sveltekit()
	]
});
