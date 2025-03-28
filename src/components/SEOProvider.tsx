import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

interface SEOProviderProps {
  children: React.ReactNode;
}

// Sitemap oldalak meta adatai
interface PageMetaData {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  ogType?: string;
}

const SEOProvider: React.FC<SEOProviderProps> = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Alapértelmezett meta adatok
  const defaultTitle = 'Vizitor.hu - Professzionális Weboldalkészítés és Marketing Szolgáltatások';
  const defaultDescription = 'Professzionális weboldalkészítés és digitális marketing. Modern, reszponzív weboldalak, SEO optimalizálás és hatékony online marketing megoldások.';
  const defaultKeywords = 'webfejlesztés, weboldalkészítés, marketing szolgáltatások, SEO, webtervezés, webdesign, digitális marketing, online marketing, honlapkészítés';
  const defaultImage = 'https://vizitor.hu/vizitor-logo.min.svg';

  // Sitemap oldalak meta adatai
  const pageMetaData: Record<string, PageMetaData> = {
    '/': {
      title: 'Vizitor.hu - Professzionális Weboldalkészítés és Marketing Szolgáltatások',
      description: defaultDescription,
      keywords: defaultKeywords,
      ogImage: defaultImage,
      ogType: 'website'
    },
    '/szolgaltatasok': {
      title: 'Szolgáltatások | Vizitor.hu',
      description: 'Webfejlesztés, digitális marketing és keresőoptimalizálás szolgáltatások. Ismerje meg teljes körű megoldásainkat vállalkozása online sikeréhez.',
      keywords: 'webfejlesztés, weboldalkészítés, digitális marketing, SEO, keresőoptimalizálás, PPC, social media marketing',
      ogImage: defaultImage,
      ogType: 'website'
    },
    '/kapcsolat': {
      title: 'Kapcsolat | Vizitor.hu',
      description: 'Vegye fel velünk a kapcsolatot! Kérjen ajánlatot webfejlesztésre, marketing szolgáltatásokra vagy egyéb digitális megoldásokra.',
      keywords: 'kapcsolat, ajánlatkérés, webfejlesztés árak, marketing árak, elérhetőségek',
      ogImage: defaultImage,
      ogType: 'website'
    },
    '/csomagok': {
      title: 'Csomagok és Árak | Vizitor.hu',
      description: 'Webfejlesztés, marketing és karbantartási csomagok minden igényre szabva. Ismerje meg árainkat és válassza ki az Önnek megfelelő megoldást.',
      keywords: 'webfejlesztés árak, marketing csomagok, weboldal karbantartás, árak, csomagok, szolgáltatási díjak',
      ogImage: defaultImage,
      ogType: 'website'
    },
    '/adatvedelem': {
      title: 'Adatvédelmi Tájékoztató | Vizitor.hu',
      description: 'Adatvédelmi tájékoztatónk részletesen ismerteti, hogyan kezeljük az Ön személyes adatait a jogszabályi előírásoknak megfelelően.',
      keywords: 'adatvédelem, GDPR, cookie kezelés, adatkezelési tájékoztató, privacy policy',
      ogImage: defaultImage,
      ogType: 'website'
    },
    '/rolunk': {
      title: 'Rólunk | Vizitor.hu',
      description: 'Ismerje meg a Vizitor csapatát! Szakértelem, tapasztalat és szenvedély a digitális megoldások területén.',
      keywords: 'vizitor csapat, webfejlesztő, marketing szakértő, rólunk, cégismertető',
      ogImage: defaultImage,
      ogType: 'website'
    }
  };

  // Hibaoldalak meta adatai
  const errorPages = {
    '404': {
      title: 'Az oldal nem található | Vizitor.hu',
      description: 'A keresett oldal nem található. Kérjük, ellenőrizze a megadott URL-t vagy térjen vissza a főoldalra.'
    },
    '403': {
      title: 'Hozzáférés megtagadva | Vizitor.hu',
      description: 'Nincs jogosultsága az oldal megtekintéséhez. Kérjük, jelentkezzen be vagy térjen vissza a főoldalra.'
    },
    '500': {
      title: 'Szerver hiba | Vizitor.hu',
      description: 'Szerver hiba történt. Kérjük, próbálja újra később vagy vegye fel a kapcsolatot ügyfélszolgálatunkkal.'
    }
  };

  // Útvonal alapján meta adatok beállítása
  let title = defaultTitle;
  let description = defaultDescription;
  let keywords = defaultKeywords;
  let ogImage = defaultImage;
  let ogType = 'website';

  // Ellenőrizzük, hogy az aktuális útvonal szerepel-e a sitemap oldalak között
  if (pathname in pageMetaData) {
    const pageData = pageMetaData[pathname];
    title = pageData.title;
    description = pageData.description;
    keywords = pageData.keywords;
    ogImage = pageData.ogImage || defaultImage;
    ogType = pageData.ogType || 'website';
  } else {
    // Hibaoldalak kezelése
    for (const [errorCode, errorData] of Object.entries(errorPages)) {
      if (pathname.includes(`/${errorCode}`)) {
        title = errorData.title;
        description = errorData.description;
        break;
      }
    }
  }

  // Teljes URL összeállítása
  const siteUrl = 'https://vizitor.hu';
  const fullUrl = `${siteUrl}${pathname}`;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Vizitor.hu" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullUrl} />
      </Helmet>
      {children}
    </>
  );
};

export default SEOProvider;