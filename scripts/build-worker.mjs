import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import path from 'node:path';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8','.bin':'application/octet-stream','.gz':'application/gzip'};
const files={};
async function collect(directory,prefix=''){
 for(const item of await readdir(directory,{withFileTypes:true})){
  if(item.name.startsWith('.')||['server','_headers','_redirects'].includes(item.name))continue;
  const relative=prefix+'/'+item.name;
  if(item.isDirectory()){await collect(path.join(directory,item.name),relative);continue;}
  const body=await readFile(path.join(directory,item.name));
  files[relative]={type:types[path.extname(item.name)]||'application/octet-stream',body:body.toString('base64'),etag:'W/"'+createHash('sha256').update(body).digest('hex').slice(0,24)+'"'};
 }
}
await collect('dist');
const rules=(await readFile('public/_redirects','utf8')).split('\n').filter(line=>line&&!line.startsWith('#')).map(line=>line.trim().split(/\s+/));
const runtime=await readFile('worker/router.js','utf8');
const output=runtime+'\nexport default createHandler('+JSON.stringify(files)+','+JSON.stringify(rules)+','+(process.env.VIZITOR_INDEXABLE==='true')+');\n';
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/server/index.js',output);await writeFile('dist/.openai/hosting.json',await readFile('.openai/hosting.json'));
console.log(`Worker built: ${Object.keys(files).length} files, ${Math.round(Buffer.byteLength(output)/1024)} KB source, ${Math.round(gzipSync(output).length/1024)} KB gzip.`);
