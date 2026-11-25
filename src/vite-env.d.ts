/// <reference types="vite/client" />
/** True when this deployment contains the static blog under /blog/. */
declare const __VIZITOR_BLOG__: boolean;

/** Published blog posts grouped by their related service URL at build time. */
declare const __VIZITOR_SERVICE_ARTICLES__: Readonly<Record<string, readonly { href: string; title: string; excerpt: string }[]>>;
