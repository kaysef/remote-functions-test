import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
// import mkcert from 'vite-plugin-mkcert';
// import Icons from 'unplugin-icons/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    enhancedImages(),
		// mkcert(),
		// Icons({
		// 	compiler: 'svelte',
		// })
	],
	// server: {
	// 	proxy: {}
	// 	// https: true
	// },
	optimizeDeps:{
		entries: ['src/routes/**/+*.{js,ts,svelte}','src/hooks*.{js,ts}'],
    exclude: [
      "swiper",
      "bits-ui",
      "@lucide/svelte",
      "clsx",
      "mode-watcher",
      "tailwind-variants",
      "tailwind-merge",
      "paneforge",
      "shiki",
      "devalue",
      "tabbale",
      "@floating-ui/dom",
      "@internationalized/date",
    ], // Avoid pre-bundling large deps that break HMR
	},
	// ssr: {
	// 	noExternal: ['chart.js'],
	// },
});



