export const serviceLinks = [
  {
    "path": "/weboldalkeszites/",
    "label": "Weboldalkészítés"
  },
  {
    "path": "/egyedi-webfejlesztes/",
    "label": "Egyedi webfejlesztés"
  },
  {
    "path": "/online-marketing/",
    "label": "Hirdetéskezelés"
  },
  {
    "path": "/keresooptimalizalas/",
    "label": "Keresőoptimalizálás"
  },
  {
    "path": "/weboldal-karbantartas/",
    "label": "Weboldal-karbantartás"
  },
  {
    "path": "/ai-chatbot-keszites/",
    "label": "AI-chatbot készítés"
  },
  {
    "path": "/automatizalas/",
    "label": "Üzleti automatizálás"
  },
  {
    "path": "/email-szerver-uzemeltetes/",
    "label": "E-mail-szerverek"
  },
  {
    "path": "/webanalitika-meres/",
    "label": "Webanalitika és MarTech"
  }
];
export function normalizePath(path:string){return path==='/'?'/':path.replace(/\/+$/,'')+'/';}
export function isServicePath(path:string){return serviceLinks.some(item=>item.path===normalizePath(path));}
export const sectionPages = [
 { path:'/szolgaltatasok/', id:'szolgaltatasok', label:'Szolgáltatások', title:'Szolgáltatások | vizitor.hu', description:'Weboldalkészítés, egyedi fejlesztés, marketing és mérés. Nézd meg a Vizitor szolgáltatásait, a webkarbantartástól az AI-chatbotokig és automatizálásig.' },
 { path:'/igy-dolgozom/', id:'folyamat', label:'Így dolgozom', title:'Így dolgozom | vizitor.hu', description:'A felépítéstől a dizájnon át az élesítésig: így készül a weboldalad a Vizitorral. Közvetlen egyeztetés, előre rögzített díj, határidő és visszajelzési pontok.' },
 { path:'/arak/', id:'csomagok', label:'Csomagok és árak', title:'Csomagok és árak | vizitor.hu', description:'Weboldalkészítés egyszeri díjjal, marketing és karbantartás havidíjjal. Hasonlítsd össze a Vizitor csomagjait és a 20% éves előrefizetési kedvezményt.' },
 { path:'/gyakori-kerdesek/', id:'kerdesek', label:'Gyakori kérdések', title:'Gyakori kérdések | vizitor.hu', description:'Mi kell az induláshoz, hogyan zajlik a közös munka, és mit tartalmaznak a díjak? Válaszok a Vizitor weboldalkészítési, marketing- és karbantartási kérdéseire.' },
 { path:'/kapcsolat/', id:'kapcsolat', label:'Kapcsolat', title:'Kapcsolat és ajánlatkérés | vizitor.hu', description:'Írd meg, milyen weboldalra, fejlesztésre vagy marketinges segítségre van szükséged. Egyszerű kapcsolatfelvétel a Vizitorral: e-mail-cím és néhány mondat elég.' },
];
export const sectionPath = (id:string) => sectionPages.find(page=>page.id===id)?.path || '/';
export const canonicalRoutes=['/','/munkak/','/adatvedelem/','/impresszum/',...sectionPages.map(item=>item.path),...serviceLinks.map(item=>item.path)];
