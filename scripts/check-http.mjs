import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=process.env.SEO_PREVIEW_URL||'http://127.0.0.1:4173';
const sitemap=await readFile('dist/sitemap.xml','utf8');
const routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1]).pathname);
for(const route of routes){const response=await fetch(base+route);assert.equal(response.status,200,route);const html=await response.text();assert.ok(html.includes('<h1'),route+' missing prerendered H1');assert.ok(html.includes('rel="canonical"'),route+' missing canonical');}
const rules=(await readFile('public/_redirects','utf8')).split('\n').filter(line=>line&&!line.startsWith('#')).map(line=>line.trim().split(/\s+/));
for(const [from,to,status] of rules){const response=await fetch(base+from,{redirect:'manual'});assert.equal(response.status,Number(status),from+' status');const location=response.headers.get('location');assert.equal(new URL(location,base).pathname+new URL(location,base).hash,to,from+' Location');}
for(const route of ['/seo-check-missing-page/','/assets/seo-check-missing.js']){const response=await fetch(base+route);assert.equal(response.status,404,route+' must be a real 404');}
console.log(`HTTP checks passed: ${routes.length} pages, ${rules.length} permanent redirects and 2 real 404 responses.`);
