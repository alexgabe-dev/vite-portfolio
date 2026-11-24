import { createHmac } from 'node:crypto';
import { leadEmail, receiptEmail } from './email-templates.js';

const MAX_BYTES = 24000;
const WINDOW = 15 * 60 * 1000;
const buckets = new Map();
const json = (status, extra = {}) => Response.json({ok:status===200,...extra},{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...(status===429?{'Retry-After':'900'}:{})}});

function takeRateLimit(key, now) {
  for (const [id,bucket] of buckets) if(now-bucket.at>=WINDOW) buckets.delete(id);
  if(buckets.size>=10000 && !buckets.has(key)) return false;
  const bucket=buckets.get(key)||{at:now,count:0};
  buckets.set(key,bucket);
  return ++bucket.count<=5;
}

export function validateLead(input) {
  if(!input || typeof input!=='object' || Array.isArray(input)) return null;
  const limits={name:100,email:254,message:5000,service:500,package:200,_gotcha:200};
  const result={};
  for(const [field,max] of Object.entries(limits)) {
    const value=input[field]??'';
    if(typeof value!=='string'||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return null;
    result[field]=value.trim();
  }
  if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(result.email)||!result.message) return null;
  for(const field of ['name','email','service','package']) if(/[\r\n]/.test(result[field])) return null;
  result.service ||= 'Egyeztetést kérek';
  return result;
}

async function readBody(request) {
  const reader=request.body?.getReader();
  if(!reader) throw new Error('body');
  const chunks=[];let bytes=0;
  try {
    while(true) {
      const {done,value}=await reader.read();if(done)break;
      bytes+=value.byteLength;
      if(bytes>MAX_BYTES){await reader.cancel();throw new Error('size');}
      chunks.push(value);
    }
  } finally {reader.releaseLock();}
  const buffer=new Uint8Array(bytes);let offset=0;
  for(const chunk of chunks){buffer.set(chunk,offset);offset+=chunk.byteLength;}
  return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(buffer));
}

// Dependency injection keeps all checks offline; never send test leads to the real inbox.
export async function handleContact(request,{env=process.env,fetchImpl=fetch,now=Date.now(),rateLimit=takeRateLimit}={}) {
  if(request.method!=='POST') return new Response(null,{status:405,headers:{Allow:'POST','Cache-Control':'no-store'}});
  const origins=new Set(['https://vizitor.hu','https://www.vizitor.hu']);
  for(const host of [env.VERCEL_URL,env.VERCEL_BRANCH_URL]) if(host)origins.add('https://'+host);
  if(env.NODE_ENV!=='production') {origins.add('http://localhost:3000');origins.add('http://127.0.0.1:3000');}
  if(!origins.has(request.headers.get('origin')))return json(403);
  if(request.headers.get('content-type')?.split(';')[0].trim()!=='application/json') return json(415);
  if(Number(request.headers.get('content-length'))>MAX_BYTES)return json(413);
  let input;
  try{input=await readBody(request);}catch(error){return json(error.message==='size'?413:400);}
  const lead=validateLead(input);
  if(!lead)return json(400);
  if(lead._gotcha)return json(200);
  const key=env.RESEND_API_KEY;
  const from=env.RESEND_FROM_EMAIL||'Vizitor <info@vizitor.hu>';
  if(!key||!/^Vizitor <[^<>\s@]+@(?:[a-z0-9-]+\.)*vizitor\.hu>$/.test(from))return json(503);
  // Preview deployments never send real mail unless explicitly enabled.
  if(env.VERCEL_ENV && env.VERCEL_ENV!=='production' && env.RESEND_ENABLE_PREVIEW!=='true')return json(503);
  const ip=request.headers.get('x-vercel-forwarded-for')||request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  const rateKey=createHmac('sha256',key).update(ip).digest('hex');
  if(!await rateLimit(rateKey,now))return json(429);
  delete lead._gotcha;
  const emails=[
    {from,to:['info@vizitor.hu'],reply_to:lead.email,...leadEmail(lead),tags:[{name:'type',value:'lead'}]},
    {from,to:[lead.email],reply_to:'info@vizitor.hu',...receiptEmail(),tags:[{name:'type',value:'receipt'}]},
  ];
  // Stable payload: retried submissions cannot send the same pair twice within 24h.
  const idempotencyKey='vizitor-lead/'+createHmac('sha256',key).update(JSON.stringify(emails)).digest('hex');
  try{
    const response=await fetchImpl('https://api.resend.com/emails/batch',{
      method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':idempotencyKey},
      body:JSON.stringify(emails),signal:AbortSignal.timeout(12000),
    });
    const result=await response.json().catch(()=>null);
    if(!response.ok||result?.data?.length!==2||result.data.some(item=>typeof item.id!=='string'||!item.id)) {
      console.error('Contact email provider rejected request',{status:response.status});
      return json(response.status===429?429:502);
    }
    return json(200);
  }catch{
    console.error('Contact email provider unavailable');
    return json(502);
  }
}
