const socials = [
 { name:'Facebook', href:'https://www.facebook.com/vizitor.hu', icon:'facebook' },
 { name:'LinkedIn', href:'https://www.linkedin.com/in/sandor-gabor/', icon:'linkedin' },
 { name:'GitHub', href:'https://github.com/alexgabe-dev', icon:'github' },
] as const;

function SocialMark({name}:{name:typeof socials[number]['icon']}){
 return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">{name==='facebook'?<path d="M13.7 22v-9h3.05l.5-3.5H13.7V7.2c0-1.05.3-1.7 1.8-1.7h1.85V2.35A23 23 0 0 0 14.65 2C12 2 10.2 3.6 10.2 6.45V9.5H7V13h3.2v9h3.5Z"/>:name==='linkedin'?<><circle cx="5.6" cy="5.4" r="1.8"/><path d="M4 8.8h3.3V20H4zm5.8 0H13v1.55c.75-1.15 1.85-1.85 3.5-1.85 3.2 0 4.5 2 4.5 5.5v6h-3.3v-5.55c0-1.8-.35-3.05-2.05-3.05-1.75 0-2.55 1.2-2.55 3.2V20H9.8V8.8Z"/></>:<path d="M12 .8a11.5 11.5 0 0 0-3.64 22.4c.57.1.78-.25.78-.55v-2.02c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.09 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.56-.3-5.25-1.28-5.25-5.7 0-1.25.45-2.27 1.18-3.07-.12-.3-.51-1.46.11-3.04 0 0 .97-.31 3.16 1.18A11 11 0 0 1 12 6.47c.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.74.12 3.04.73.8 1.17 1.82 1.17 3.07 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.03c0 .3.2.66.79.55A11.5 11.5 0 0 0 12 .8Z"/>}</svg>;
}

export function FooterSocials(){
 return <nav className="footer-socials" aria-label="Közösségi oldalak">{socials.map(social=><a key={social.icon} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name+' (új lapon)'}><SocialMark name={social.icon}/></a>)}</nav>;
}
