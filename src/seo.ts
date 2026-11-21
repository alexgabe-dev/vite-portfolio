import { categories } from './content/packages';
import { services } from './content/services';
import { projects } from './content/projects';
import { canonicalRoutes, normalizePath } from './routes';
export { canonicalRoutes } from './routes';
export const siteOrigin='https://vizitor.hu';
const organizationId=siteOrigin+'/#vizitor';
function offerCatalog(categoryId:string,planNames:string[]=[]){
 const category=categories.find(item=>item.id===categoryId)!;
 return {'@type':'OfferCatalog',name:category.label+' csomagok',itemListElement:category.plans.filter(plan=>!planNames.length||planNames.includes(plan.name)).map(plan=>({
  '@type':'Offer',name:plan.name,url:siteOrigin+(categoryId==='web'?'/weboldalkeszites/':categoryId==='care'?'/weboldal-karbantartas/':plan.name==='Keresőoptimalizálás'?'/keresooptimalizalas/':'/online-marketing/')+'#szolgaltatas-arak',
  seller:{'@id':organizationId},description:[plan.description,...plan.features].join('. ')+(categoryId==='web'?'. Induló ár; a pontos díj egyedi ajánlat szerint.':'. Éves fizetéssel 20% kedvezmény, 12 hónap díja előre fizetendő.'),
  priceSpecification:categoryId==='web'?{'@type':'PriceSpecification',minPrice:plan.price,priceCurrency:'HUF'}:{'@type':'UnitPriceSpecification',price:plan.price,priceCurrency:'HUF',unitText:'hónap',billingDuration:'P1M'},
 }))};
}
export function pageMetadata(input:string,socialOrigin=siteOrigin){
 const image=new URL('/og/vizitor-share-2026.png',socialOrigin).href;
 const route=normalizePath(input);
 const archive=route==='/munkak/',legal=route==='/adatvedelem/';
 const service=services.find(item=>item.path===route);
 const notFound=!canonicalRoutes.includes(route);
 const title=notFound?'Az oldal nem található | Vizitor':service?.title||(legal?'Adatkezelési tájékoztató | Vizitor':archive?'Weboldalak és webalkalmazások – Referenciák | Vizitor':'vizitor.hu – Weboldal, marketing, fejlesztés');
 const description=notFound?'A keresett oldal nem található. A Vizitor főoldalán eléred a szolgáltatásokat, árakat és elérhetőségeket.':service?.description||(legal?'A Vizitor adatkezelési tájékoztatója: kezelt adatok, megőrzési idők, sütik, érintetti jogok és az adatkezelő elérhetőségei.':archive?'Nézd meg a Vizitor referenciáit: Palackverseny, Recruit Planner, KÉRA és Kiwi Reels. Weboldalak és egyedi webalkalmazások, rövid projektleírásokkal.':'Weboldalkészítés, egyedi fejlesztés, AI-chatbot, automatizálás, marketing és mérés. Webkarbantartás és e-mail-rendszerek, közvetlen együttműködésben.');
 const url=siteOrigin+(notFound?'/404.html':route);
 const breadcrumbLabel=service?.label||(archive?'Projektek':'Adatvédelem');
 const serviceNodes=services.filter(item=>route==='/'||item.path===route).map(item=>({'@type':'Service','@id':siteOrigin+item.path+'#service',name:item.label,serviceType:item.label,url:siteOrigin+item.path,description:item.lead,provider:{'@id':organizationId},areaServed:{'@type':'Country',name:'Magyarország'},...(item.category?{hasOfferCatalog:offerCatalog(item.category,item.planNames)}:{})}));
 return {title,description,url,canonical:notFound?null:url,image,imageAlt:'Vizitor — Weboldal. Rád tervezve. Weboldal, marketing és karbantartás.',notFound,breadcrumbLabel,schema:{
  '@context':'https://schema.org','@graph':[
   {'@type':'Organization','@id':organizationId,name:'Vizitor',alternateName:'Vizitor.hu',url:siteOrigin+'/',logo:{'@type':'ImageObject',url:siteOrigin+'/vizitor-logo-orange.svg',width:328,height:103},email:'info@vizitor.hu',telephone:'+36205180921',description:'Weboldalkészítés, egyedi fejlesztések, AI-chatbotok, automatizálás, webanalitika, hirdetéskezelés, webkarbantartás és e-mail-rendszerek.',founder:{'@type':'Person',name:'Gábor Sándor'},contactPoint:{'@type':'ContactPoint',contactType:'ügyfélkapcsolat',email:'info@vizitor.hu',telephone:'+36205180921',availableLanguage:'hu'}},
   {'@type':'WebSite','@id':siteOrigin+'/#website',name:'Vizitor',alternateName:'Vizitor.hu',url:siteOrigin+'/',inLanguage:'hu-HU',publisher:{'@id':organizationId}},
   {'@type':'ImageObject','@id':siteOrigin+'/#social-image',url:image,contentUrl:image,width:1200,height:630,caption:'Vizitor — Weboldal. Marketing. Karbantartás.'},
   {'@type':archive?'CollectionPage':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'hu-HU',isPartOf:{'@id':siteOrigin+'/#website'},about:{'@id':organizationId},primaryImageOfPage:{'@id':siteOrigin+'/#social-image'},...(!notFound&&route!=='/'?{breadcrumb:{'@id':url+'#breadcrumb'}}:{}),...(service?{mainEntity:{'@id':url+'#service'}}:archive?{mainEntity:{'@id':url+'#projects'}}:{})},
   ...(!notFound&&route!=='/'?[{'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Főoldal',item:siteOrigin+'/'},{'@type':'ListItem',position:2,name:breadcrumbLabel,item:url}]}]:[]),
   ...serviceNodes,
   ...(archive?[{'@type':'ItemList','@id':url+'#projects',name:'A Vizitor válogatott munkái',numberOfItems:projects.length,itemListElement:projects.map((project,index)=>({'@type':'ListItem',position:index+1,item:{'@type':'CreativeWork',name:project.name,url:project.href,description:project.description,...(project.image?{image:siteOrigin+project.image}:{})}}))}]:[]),
  ]
 }};
}
