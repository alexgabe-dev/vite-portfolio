import assert from 'node:assert/strict';
import { handleContact, validateLead } from '../server/contact.js';
import { leadEmail, receiptEmail } from '../server/email-templates.js';
import { readFile } from 'node:fs/promises';

const lead={name:'Teszt Érdeklődő',email:'delivered@resend.dev',message:'Weboldalt szeretnék.\nKöszönöm!',service:'Weboldal',package:'Induló',_gotcha:''};
const env={RESEND_API_KEY:'offline-test-key',NODE_ENV:'production',VERCEL_ENV:'production'};
const calls=[];
const fetchImpl=async(url,options)=>{calls.push({url,...options});return Response.json({data:[{id:'lead-test'},{id:'receipt-test'}]});};
const request=(data=lead,options={})=>new Request('https://vizitor.hu/api/contact/',{method:'POST',headers:{origin:'https://vizitor.hu','content-type':'application/json',...options.headers},body:JSON.stringify(data)});
const send=(req=request(),options={})=>handleContact(req,{env,fetchImpl,rateLimit:()=>true,...options});
assert.equal((await send()).status,200);
assert.deepEqual(await (await send()).json(),{ok:true});
const emails=JSON.parse(calls[0].body);
assert.equal(calls[0].url,'https://api.resend.com/emails/batch');
assert.deepEqual(emails[0].to,['info@vizitor.hu']);
assert.equal(emails[0].reply_to,lead.email);
assert.deepEqual(emails[1].to,[lead.email]);
assert.equal(emails[1].reply_to,'info@vizitor.hu');
assert.equal(calls[0].headers['Idempotency-Key'],calls[1].headers['Idempotency-Key']);
assert.ok(!calls[0].headers['Idempotency-Key'].includes(lead.email));
await send(request({...lead,message:'Másik üzenet'}));
assert.notEqual(calls[0].headers['Idempotency-Key'],calls[2].headers['Idempotency-Key']);
const count=calls.length;
for(const bad of [{...lead,email:'a@b.hu\r\nBcc: victim@example.com'},{...lead,message:''},{...lead,name:'x'.repeat(101)},{...lead,email:['a@b.hu']},{...lead,package:'x'.repeat(201)},{...lead,message:'a\u0000b'},null,[]]) assert.equal((await send(request(bad))).status,400);
assert.equal((await send(request(lead,{headers:{origin:'https://attacker.example'}}))).status,403);
assert.equal((await send(request(lead,{headers:{'content-type':'text/plain'}}))).status,415);
assert.equal((await send(request({...lead,message:'a'.repeat(25000)}))).status,413);
assert.equal((await send(request(),{env:{NODE_ENV:'production'}})).status,503);
assert.equal((await send(request(),{env:{...env,VERCEL_ENV:'preview'}})).status,503);
assert.equal((await send(request(),{rateLimit:()=>false})).status,429);
assert.equal((await send(new Request('https://vizitor.hu/api/contact/'))).status,405);
assert.equal((await send(request({...lead,_gotcha:'spam'}))).status,200);
assert.equal(calls.length,count,'Invalid, spam or blocked requests must not contact Resend');
const oldError=console.error;console.error=()=>{};
try {
  for(const response of [Response.json({message:'PRIVATE_PROVIDER_ERROR'},{status:500}),Response.json({data:[{id:'only-one'}]}),Response.json({data:[{id:''},{id:'second'}]})]) {
    const failed=await send(request(),{fetchImpl:async()=>response});assert.equal(failed.status,502);assert.deepEqual(await failed.json(),{ok:false});
  }
  assert.equal((await send(request(),{fetchImpl:async()=>{throw new Error('PRIVATE');}})).status,502);
  assert.equal((await send(request(),{fetchImpl:async()=>Response.json({},{status:429})})).status,429);
}finally{console.error=oldError;}
for(let i=0;i<5;i++) assert.equal((await send(request(),{rateLimit:undefined,now:100})).status,200);
assert.equal((await send(request(),{rateLimit:undefined,now:100})).status,429);
assert.equal((await send(request(),{rateLimit:undefined,now:900101})).status,200);
const hostile=leadEmail({...lead,name:'<img src=x onerror=evil()>',message:'<script>evil()</script>\n& "hello"'});
assert.ok(!hostile.html.includes('<script>'));
assert.ok(!hostile.html.includes('<img src=x'));
assert.ok(hostile.html.includes('&lt;script&gt;'));
assert.ok(hostile.text.includes('<script>evil()</script>'));
assert.ok(!receiptEmail().html.includes(lead.message));
assert.ok(validateLead({...lead,service:''}).service);
const contact=await readFile('src/components/ContactSection.tsx','utf8');
assert.ok(contact.includes("CONTACT_ENDPOINT = '/api/contact/'"));
assert.ok(contact.includes("'Content-Type':'application/json'"));
assert.ok(!contact.includes('_subject'));assert.ok(!contact.includes('_replyto'));
console.log('Email checks passed: lead + receipt, server-only credentials, fixed inbox, reply-to, idempotency, validation, body limits, origin checks, spam trap, rate limit, preview safety, provider failure and HTML escaping. No real emails sent.');
