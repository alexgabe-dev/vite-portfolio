import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const worker=(await import(pathToFileURL(path.resolve('dist/server/index.js')).href)).default;
const origin='https://preview.example';
const sitemap=await readFile('dist/sitemap.xml','utf8');
const routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1]).pathname);
const privateBuild=!(process.argv.includes('--indexable'));
for(const route of routes){
 const response=await worker.fetch(new Request(origin+route,{headers:{'Accept-Encoding':'gzip'}}));
 assert.equal(response.status,200,route);assert.equal(response.headers.get('Content-Encoding'),null);
 const html=Buffer.from(await response.arrayBuffer()).toString('utf8');assert.ok(html.includes('<h1'));assert.ok(html.includes('rel="canonical"'));
 assert.equal(response.headers.has('X-Robots-Tag'),privateBuild);
 const head=await worker.fetch(new Request(origin+route,{method:'HEAD'}));assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);
}
const rules=(await readFile('public/_redirects','utf8')).split('\n').filter(line=>line&&!line.startsWith('#')).map(line=>line.trim().split(/\s+/));
for(const [from,to] of rules){const response=await worker.fetch(new Request(origin+from));assert.equal(response.status,301,from);assert.equal(new URL(response.headers.get('Location'),origin).href,origin+to);}
for(const route of ['/missing-page/','/assets/missing.js','/_redirects','/.openai/hosting.json']){const response=await worker.fetch(new Request(origin+route));assert.equal(response.status,404,route);assert.equal(response.headers.get('X-Robots-Tag'),'noindex, follow');}
for(const [input,target] of [['http://vizitor.hu/weboldalkeszites/','https://vizitor.hu/weboldalkeszites/'],['https://www.vizitor.hu/','https://vizitor.hu/'],[origin+'/webanalitika-meres/index.html',origin+'/webanalitika-meres/'],[origin+'/kapcsolat?forras=teszt',origin+'/?forras=teszt#kapcsolat']]){const response=await worker.fetch(new Request(input));assert.equal(response.status,301);assert.equal(new URL(response.headers.get('Location'),origin).href,target);}
const index=await readFile('dist/index.html','utf8');const asset=index.match(/src="(\/assets\/[^\"]+\.js)"/)[1];
const response=await worker.fetch(new Request(origin+asset));assert.ok(response.headers.get('Cache-Control').includes('immutable'));const etag=response.headers.get('ETag');
const cached=await worker.fetch(new Request(origin+asset,{headers:{'If-None-Match':etag}}));assert.equal(cached.status,304);assert.equal((await cached.arrayBuffer()).byteLength,0);
assert.equal((await worker.fetch(new Request(origin+'/',{method:'POST'}))).status,405);
console.log(`Worker checks passed: ${routes.length} HTML pages and HEAD requests, ${rules.length} 301s, host normalization, query preservation, true 404s and ETag/304 caching.`);
