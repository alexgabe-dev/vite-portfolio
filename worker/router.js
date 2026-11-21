// Static React output, served with explicit HTTP routing and no request-time rendering.
function createHandler(files, rules, indexable) {
 const decoded=new Map();
 const pages=new Set(Object.keys(files).filter(path=>path.endsWith('/index.html')).map(path=>path.slice(0,-10)));
 const headersFor=()=>new Headers({'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin',...(!indexable?{'X-Robots-Tag':'noindex, follow'}:{})});
 function redirect(url,target){const destination=new URL(target,url.origin);destination.search=url.search;const headers=headersFor();headers.set('Location',destination.pathname+destination.search+destination.hash);headers.set('Cache-Control','public, max-age=300');return new Response(null,{status:301,headers});}
 function bytes(key,encoded){if(!decoded.has(key))decoded.set(key,Uint8Array.from(atob(encoded),character=>character.charCodeAt(0)));return decoded.get(key);}
 return {async fetch(request){
  const url=new URL(request.url);
  if(url.hostname==='www.vizitor.hu'||(url.hostname==='vizitor.hu'&&url.protocol!=='https:')){const canonical=new URL(url.pathname+url.search,'https://vizitor.hu');return new Response(null,{status:301,headers:{Location:canonical.href}});}
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{return new Response('Bad request',{status:400});}
  const rule=rules.find(([from])=>from===pathname);if(rule)return redirect(url,rule[1]);
  if(pathname.endsWith('/index.html')&&pages.has(pathname.slice(0,-10)))return redirect(url,pathname.slice(0,-10));
  if(!pathname.endsWith('/')&&pages.has(pathname+'/'))return redirect(url,pathname+'/');
  let key=pathname.endsWith('/')?pathname+'index.html':pathname;
  if(key==='/_headers'||key==='/_redirects'||key.startsWith('/.'))key='';
  let status=200,entry=files[key];
  if(!entry){status=404;key='/404.html';entry=files[key];}
  if(pathname==='/404.html')status=404;
  const headers=headersFor();headers.set('Content-Type',entry.type);headers.set('ETag',entry.etag);
  headers.set('Cache-Control',key.startsWith('/assets/')?'public, max-age=31536000, immutable':entry.type.startsWith('text/html')?'no-cache':key==='/robots.txt'||key==='/sitemap.xml'?'public, max-age=300':'public, max-age=86400');
  if(status===404)headers.set('X-Robots-Tag','noindex, follow');
  if(status===200&&request.headers.get('If-None-Match')===entry.etag)return new Response(null,{status:304,headers});
  return new Response(request.method==='HEAD'?null:bytes(key,entry.body),{status,headers});
 }};
}
