import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
const indexable=process.argv.includes('--indexable');
const origin='https://vizitor.hu';
const decode=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'");
const sitemap=await readFile('dist/sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>decode(match[1]));
const isBlog=url=>new URL(url).pathname.startsWith('/blog/');
assert.equal(urls.filter(url=>!isBlog(url)).length,18,'Expected 18 canonical site pages');assert.equal(new Set(urls).size,urls.length,'Duplicate sitemap URL');
const pages=new Map();const titles=new Set(),descriptions=new Set();
for(const url of urls){
 assert.equal(new URL(url).origin,origin);assert.ok(url.endsWith('/'));assert.ok(!url.includes('?')&&!url.includes('#'));
 const route=new URL(url).pathname;
 const html=await readFile(route==='/'?'dist/index.html':`dist${route}index.html`,'utf8');
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];
 const description=html.match(/<meta name="description" content="([^"]*)"/)?.[1];
 const blog=route.startsWith('/blog/');
 assert.ok(title&&title.length<(blog?110:80),route+' title');assert.ok(description&&description.length>=(blog?40:80)&&description.length<=200,route+' description');
 assert.ok(!titles.has(title),'Duplicate title');assert.ok(!descriptions.has(description),'Duplicate description');titles.add(title);descriptions.add(description);
 assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length,1,route+' must have one H1');
 assert.equal([...html.matchAll(/rel="canonical"/g)].length,1);assert.equal(html.match(/<link rel="canonical" href="([^"]*)"/)?.[1],url);
 assert.ok(html.includes(blog?'<html lang="hu" data-vizitor-section="blog">':'<html lang="hu">'));assert.ok(html.includes('name="viewport"'));
 const robots=html.match(/<meta name="robots" content="([^"]*)"/)?.[1];assert.ok(robots?.startsWith(indexable?'index,':'noindex,'),route+' indexing mode');
 for(const token of ['og:title','og:description','og:url','og:image','og:image:width','og:image:height','og:image:alt'])assert.ok(html.includes(`property="${token}"`),token);
 for(const token of ['twitter:card','twitter:title','twitter:description','twitter:image','twitter:image:alt'])assert.ok(html.includes(`name="${token}"`),token);
 assert.ok(html.includes('content="1200"'));assert.ok(html.includes('content="630"'));
 const socialImage=html.match(/<meta property="og:image" content="([^"]*)"/)?.[1];
if(!blog) assert.equal(socialImage, (indexable?origin:(process.env.VIZITOR_PREVIEW_ORIGIN||'https://vizitor-portfolio-nov26.delego-munka-1424.chatgpt.site'))+'/og/vizitor-share-2026.png');
 assert.ok(html.includes('<meta name="twitter:image" content="'+socialImage+'"')); 
 const json=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];assert.ok(json,'Missing JSON-LD');
 const graph=JSON.parse(json)['@graph'];const definitions=new Set(graph.map(item=>item['@id']).filter(Boolean));
 function references(node){if(!node||typeof node!=='object')return;if(Object.keys(node).length===1&&node['@id']?.startsWith(origin))assert.ok(definitions.has(node['@id']),'Unresolved graph reference '+node['@id']);Object.values(node).forEach(value=>Array.isArray(value)?value.forEach(references):references(value));}references(graph);
 assert.ok(graph.some(item=>item['@type']==='Organization'));assert.ok(graph.some(item=>item['@type']==='WebSite'));
 if(route!=='/')assert.ok(graph.some(item=>item['@type']==='BreadcrumbList'));
 assert.ok(!graph.some(item=>['Review','AggregateRating','Product'].includes(item['@type'])),'Do not invent review/product markup');
 pages.set(route,html);
}
for(const [route,html] of pages){
 const body=html.split('<body>')[1];
 for(const match of body.matchAll(/(?:src|href)="([^"]+)"/g)){
  const value=decode(match[1]);if(!value.startsWith('/')&&!value.startsWith('#'))continue;
  const url=new URL(value,origin+route);
  if(url.pathname.endsWith('/')){if(!pages.has(url.pathname)&&url.pathname.startsWith('/blog/')){await access(path.join('dist',url.pathname,'index.html'));continue;}assert.ok(pages.has(url.pathname),route+' broken internal URL '+value);if(url.hash){const target=pages.get(url.pathname);const id=decodeURIComponent(url.hash.slice(1));assert.ok(target.includes(`id="${id}"`),route+' broken anchor '+value);}}
  else await access(path.join('dist',url.pathname));
 }
}
const missing=await readFile('dist/404.html','utf8');assert.ok(missing.includes('noindex, follow'));assert.ok(!missing.includes('rel="canonical"'));assert.ok(missing.includes('Erre nincs oldal.'));
const robots=await readFile('dist/robots.txt','utf8');assert.ok(robots.includes(indexable?'Allow: /':'Disallow: /'));if(indexable)assert.ok(robots.includes(origin+'/sitemap.xml'));
const headers=await readFile('dist/_headers','utf8');assert.equal(headers.includes('X-Robots-Tag: noindex'),!indexable);
const png=await readFile('dist/og/vizitor-share-2026.png');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
const blogCount=[...pages.keys()].filter(r=>r.startsWith('/blog/')).length;
console.log(`SEO checks passed: ${pages.size-blogCount} canonical pages${blogCount?` + ${blogCount} blog pages`:''}, unique titles/descriptions, H1, schemas, images, internal links, 404 and ${indexable?'public':'private'} indexing.`);
