import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import { leadEmail, receiptEmail } from '../server/email-templates.js';

await mkdir('public/email',{recursive:true});
// PNG fallback of the original logo: supported by mail clients that do not render SVG.
const svg=await readFile('public/vizitor-logo.svg','utf8');
await writeFile('public/email/vizitor-logo.png',new Resvg(svg,{fitTo:{mode:'width',value:528}}).render().asPng());
await mkdir('.cache/email-preview',{recursive:true});
const sample={name:'Kovács Anna',email:'anna@example.com',service:'Weboldal, Marketing és mérés',package:'Egyedi ajánlat',message:'Szia!\n\nÚj weboldalt szeretnék a vállalkozásomnak, és a kampányok mérésében is segítséget kérek.\n\nÁt tudjuk beszélni a lehetőségeket?'};
const logo=await readFile('public/email/vizitor-logo.png');
for(const [name,email] of [['lead',leadEmail(sample)],['receipt',receiptEmail()]]) {
  await writeFile(`.cache/email-preview/${name}.html`,email.html.replace('https://vizitor.hu/email/vizitor-logo.png','data:image/png;base64,'+logo.toString('base64')));
}
console.log('Email previews: .cache/email-preview/lead.html and receipt.html');
