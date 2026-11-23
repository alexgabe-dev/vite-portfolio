import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
const temporary=path.resolve('.cache/prerender.mjs');
await mkdir(path.dirname(temporary),{recursive:true});
const indexable=process.env.VIZITOR_INDEXABLE==='true';
// Social crawlers need the image on the same published origin as the shared preview.
const socialOrigin=indexable?'https://vizitor.hu':(process.env.VIZITOR_PREVIEW_ORIGIN||'https://vizitor-portfolio-nov26.delego-munka-1424.chatgpt.site');
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
try{
 await build({entryPoints:['src/App.tsx'],outfile:temporary,bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.svg':'text'},jsx:'automatic',logLevel:'silent'});
 const {default:App,pageMetadata,Privacy,ServicePage}=await import(pathToFileURL(temporary).href);
 // Read the same route registry used in the client, without a separate URL list.
 const routeBundle=path.resolve('.cache/routes.mjs');
 await build({entryPoints:['src/routes.ts'],outfile:routeBundle,bundle:true,platform:'node',format:'esm',logLevel:'silent'});
 const {canonicalRoutes,isServicePath}=await import(pathToFileURL(routeBundle).href);
 const template=await readFile('dist/index.html','utf8');
 if(!template.includes('<div id="root"></div>'))throw Error('Missing prerender target');
 for(const route of [...canonicalRoutes,'/404/']){
  const metadata=pageMetadata(route,socialOrigin);
  const markup=renderToString(createElement(App,{page:route,privacyContent:route==='/adatvedelem/'?createElement(Privacy):undefined,serviceContent:isServicePath(route)?createElement(ServicePage,{path:route}):undefined}));
  const target=route==='/404/'?'dist/404.html':route==='/'?'dist/index.html':`dist${route}index.html`;
  const indexing=indexable&&!metadata.notFound?'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1':'noindex, follow';
  const extra=`
${metadata.canonical?`<link rel="canonical" href="${escape(metadata.canonical)}" />`:''}
<meta property="og:url" content="${escape(metadata.url)}" />
<meta property="og:site_name" content="Vizitor" />
<meta property="og:locale" content="hu_HU" />
<meta property="og:image" content="${metadata.image}" />
<meta property="og:image:secure_url" content="${metadata.image}" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${escape(metadata.imageAlt)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escape(metadata.title)}" />
<meta name="twitter:description" content="${escape(metadata.description)}" />
<meta name="twitter:image" content="${metadata.image}" />
<meta name="twitter:image:alt" content="${escape(metadata.imageAlt)}" />
<script type="application/ld+json">${JSON.stringify(metadata.schema).replaceAll('<','\\u003c')}</script>
`;
  let html=template.replace('<div id="root"></div>',`<div id="root">${markup}</div>`)
   .replace(/<title>.*?<\/title>/,`<title>${escape(metadata.title)}</title>`)
   .replace(/(<meta name="description" content=")[^"]*/,'$1'+escape(metadata.description))
   .replace(/(<meta property="og:title" content=")[^"]*/,'$1'+escape(metadata.title))
   .replace(/(<meta property="og:description" content=")[^"]*/,'$1'+escape(metadata.description))
   .replace(/(<meta name="robots" content=")[^"]*/,'$1'+indexing)
   .replace('</head>',extra+'</head>');
  if(route!=='/')html=html.replace(/<link rel="preload" href="\/graphics\/signature-clean.webp"[^>]*>/,'');
  await mkdir(path.dirname(target),{recursive:true});await writeFile(target,html);
  console.log(`Prerendered ${route}: ${markup.length} characters.`);
 }
 const origin='https://vizitor.hu';
 const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${canonicalRoutes.map(route=>`<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>\n`;
 await writeFile('dist/sitemap.xml',sitemap);
 await writeFile('dist/robots.txt',indexable?`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
 const headers=`/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/fonts/*\n  Cache-Control: public, max-age=2592000\n/og/*\n  Cache-Control: public, max-age=86400\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n${indexable?'':'  X-Robots-Tag: noindex, follow\n'}`;
 await writeFile('dist/_headers',headers);
 await rm(routeBundle,{force:true});
}finally{await rm(temporary,{force:true});}
