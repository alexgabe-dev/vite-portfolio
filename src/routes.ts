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
export const canonicalRoutes=['/','/munkak/','/adatvedelem/',...serviceLinks.map(item=>item.path)];
