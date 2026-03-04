
import { Code, BarChart, Settings, Lightbulb, Handshake, Target } from 'lucide-react';

export const navigation = [
    { name: 'Főoldal', path: '/' },
    { name: 'Szolgáltatások', path: '/szolgaltatasok' },
    { name: 'Csomagok', path: '/csomagok' },
    { name: 'Kapcsolat', path: '/kapcsolat' },
];

export const packages = [
    {
        title: "Lanuch Web Csomag",
        price: "189.000 Ft",
        priceSuffix: "-tól",
        type: "Egyszeri díj",
        features: [
            "1-4 oldalas modern, reszponzív weboldal",
            "Kulcsoldalak felépítése (Főoldal, Rólunk, Szolgáltatások, Kapcsolat)",
            "Technikai alap SEO beállítások",
            "Kapcsolati űrlap és mérési események bekötése",
            "Google Analytics 4 és Search Console integráció",
            "Alap sebességoptimalizálás",
            "Ingyenes SSL tanúsítvány és biztonsági alapbeállítás",
            "1 hónap garanciális karbantartás"
        ],
        isPopular: false
    },
    {
        title: "Premium Web Csomag",
        price: "329.000 Ft",
        priceSuffix: "-tól",
        type: "Egyszeri díj",
        features: [
            "Minden a Rajt csomagból, plusz:",
            "Legfeljebb 12 oldalas weboldal struktúra",
            "Blog vagy tudástár modul",
            "Haladó on-page SEO (meta, schema, belső linkelés)",
            "Hírlevél-feliratkozás és automatizált e-mail indulás",
            "Egyedi CTA blokkok és konverziós szekciók",
            "Cookie banner és GDPR finomhangolás",
            "Alap CRM vagy időpontfoglaló integráció",
            "2 hónap garanciális karbantartás"
        ],
        isPopular: true
    },
    {
        title: "Corporate Web Csomag",
        price: "549.000 Ft",
        priceSuffix: "-tól",
        type: "Egyszeri díj",
        features: [
            "Minden a Növekedés csomagból, plusz:",
            "Webshop vagy komplex szolgáltatói rendszer kialakítás",
            "Többnyelvű működés és tartalomstruktúra",
            "Fizetési és számlázási integrációk",
            "Haladó technikai SEO és Core Web Vitals optimalizáció",
            "Egyedi automatizmusok (ajánlatkérő, follow-up, lead kezelés)",
            "Fejlett biztonsági és hozzáférés-kezelési megoldások",
            "3 hónap garanciális karbantartás"
        ],
        isPopular: false
    }
];

export const stats = [
    { value: 88, label: 'az online vásárlók közül nem tér vissza egy rossz vásárlási élmény után', colorFrom: '#ff5c35', colorTo: '#ff8f35', suffix: '%' },
    { value: 75, label: 'a felhasználóknak a weboldal alapján ítéli meg a cég hitelességét', colorFrom: '#ff8f35', colorTo: '#ff5c35', suffix: '%' },
    { value: 61, label: 'a felhasználók elhagyják a mobilos felületen rosszul működő oldalt', colorFrom: '#ff5c35', colorTo: '#ff8f35', suffix: '%' },
    { value: 8, label: 'felhasználó abbahagyja a böngészést, ha az oldal nem jelenik meg megfelelően', colorFrom: '#ff8f35', colorTo: '#ff5c35', suffix: '/10' },
    { value: 94, label: 'a negatív visszajelzéseknek a weboldal dizájnjával kapcsolatosak', colorFrom: '#ff5c35', colorTo: '#ff8f35', suffix: '%' },
];

export const techStack = [
    {
        name: "WordPress",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
        color: "from-[#21759B]/20 to-[#21759B]/5"
    },
    {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
        color: "from-[#F24E1E]/20 to-[#F24E1E]/5"
    },
    {
        name: "Webflow",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webflow/webflow-original.svg",
        color: "from-[#4353FF]/20 to-[#4353FF]/5"
    },
    {
        name: "HTML5",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        color: "from-[#E34F26]/20 to-[#E34F26]/5"
    },
    {
        name: "CSS3",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        color: "from-[#1572B6]/20 to-[#1572B6]/5"
    },
    {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        color: "from-[#F7DF1E]/20 to-[#F7DF1E]/5"
    },
    {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        color: "from-[#61DAFB]/20 to-[#61DAFB]/5"
    },
    {
        name: "Vite",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
        color: "from-[#646CFF]/20 to-[#646CFF]/5"
    },
    {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        color: "from-[#000000]/20 to-[#000000]/5"
    },
    {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        color: "from-[#3178C6]/20 to-[#3178C6]/5"
    },
    {
        name: "Svelte",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
        color: "from-[#FF3E00]/20 to-[#FF3E00]/5"
    },
    {
        name: "PHP",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
        color: "from-[#777BB4]/20 to-[#777BB4]/5"
    }
];

// Note: Values with icons (Lucide React components) will need to be handled carefuly
// if we move them here, we need to import the icons here too.
// For now, I'll keep strict data here. Providing icons as strings or handling them in component is better.
