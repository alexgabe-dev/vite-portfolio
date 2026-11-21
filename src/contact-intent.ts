import type { ContactIntent } from './components/ContactSection';
const storageKey='vizitor.inquiry-selection';
const services=['Weboldal','Egyedi fejlesztés','AI és automatizálás','Marketing és mérés','Karbantartás','E-mail-rendszer'];
const paths:Record<string,string>={
 '/weboldalkeszites/':'Weboldal','/egyedi-webfejlesztes/':'Egyedi fejlesztés',
 '/online-marketing/':'Marketing és mérés','/keresooptimalizalas/':'Marketing és mérés','/webanalitika-meres/':'Marketing és mérés',
 '/weboldal-karbantartas/':'Karbantartás','/ai-chatbot-keszites/':'AI és automatizálás','/automatizalas/':'AI és automatizálás','/email-szerver-uzemeltetes/':'E-mail-rendszer',
};
export function rememberInquiry(path:string,plan?:string){
 try{sessionStorage.setItem(storageKey,JSON.stringify({service:paths[path],plan,savedAt:Date.now()}));}catch{/* The link still works if browser storage is unavailable. */}
}
export function takeInquiry():ContactIntent|undefined{
 try{
  const raw=sessionStorage.getItem(storageKey);sessionStorage.removeItem(storageKey);if(!raw)return;
  const value=JSON.parse(raw);const age=Date.now()-value.savedAt;
  if(!services.includes(value.service)||!Number.isFinite(age)||age<0||age>900000)return;
  return {service:value.service,plan:typeof value.plan==='string'?value.plan.slice(0,300):undefined,key:Date.now()};
 }catch{return;}
}
