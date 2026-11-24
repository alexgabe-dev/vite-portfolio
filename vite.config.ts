import { defineConfig } from 'vite';
// Set by scripts/build-vercel.mjs only when the static blog is really built into this deployment.
const blogEnabled = process.env.VIZITOR_BLOG === 'true';
export default defineConfig({
 define:{__VIZITOR_BLOG__:JSON.stringify(blogEnabled)},
 build:{rollupOptions:{onwarn(warning,warn){if(warning.code==='MODULE_LEVEL_DIRECTIVE'&&warning.message.includes('use client'))return;warn(warning);}}},
});
