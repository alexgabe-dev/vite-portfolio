import { Icon } from './Icon';
import { Sculpture } from './Sculpture';

export function Hero() {
  return <section className="brand-hero hero-story" aria-labelledby="hero-title">
    <div className="hero-atmosphere" aria-hidden="true"/>
    <div className="hero-mobile-lines" aria-hidden="true"><svg className="hero-line-corner" viewBox="0 0 260 260" fill="none"><path d="M40-30v110a90 90 0 0 0 90 90h160"/><path d="M68-30v110a62 62 0 0 0 62 62h160"/><path d="M96-30v110a34 34 0 0 0 34 34h160"/></svg><svg className="hero-line-base" viewBox="0 0 200 200" fill="none"><path d="M-25 30h65a95 95 0 0 1 95 95v100"/><path d="M-25 58h65a67 67 0 0 1 67 67v100"/></svg></div>
    <div className="hero-story-track">
      <div className="wrap brand-hero-grid hero-story-slide">
        <div className="brand-hero-copy">
          <p className="eyebrow"><span className="copper-rule"/>Vizitor · Weboldal, marketing, karbantartás</p>
          <h1 id="hero-title">Weboldal.<br/><span>Rád tervezve.</span></h1>
          <p className="hero-lead"><span className="hero-lead-full">Weboldalkészítés és egyedi webfejlesztés vállalkozásoknak. Mobilon is átgondolt felülettel, keresőoptimalizálással és indulás utáni támogatással.</span><span className="hero-lead-compact">Weboldalkészítés, marketing és karbantartás vállalkozásoknak. Egy helyen, közvetlenül velem.</span></p>
          <div className="hero-actions">
            <a className="button orange" href="/kapcsolat/">Ajánlatot kérek<span className="button-spark" aria-hidden="true"><Icon name="spark"/></span><span className="hero-mobile-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span></a>
            <a className="text-link" href="/szolgaltatasok/">Mit tud a Vizitor?</a>
            <a className="hero-mobile-services" href="/szolgaltatasok/">Szolgáltatások<span aria-hidden="true"><Icon name="arrow-down"/></span></a>
          </div>
          <p className="hero-microcopy">Weboldal, hirdetés, karbantartás. Egy helyen.</p>
        </div>
        <div className="signature-stage"><div className="hero-art-desktop"><Sculpture/></div></div>
      </div>
    </div>
    <div className="hero-ghost" aria-hidden="true"><img src="/vizitor-logo.svg" alt="" width="328" height="103"/></div>
    <div className="wrap hero-baseline"><span>Weboldal &nbsp;/&nbsp; Marketing &nbsp;/&nbsp; Karbantartás</span><a href="/szolgaltatasok/">Nézz körül<span className="scroll-cue" aria-hidden="true"/></a></div>
  </section>;
}
