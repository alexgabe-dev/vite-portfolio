
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Hero from '../components/sections/Hero';

const Statistics = React.lazy(() => import('../components/sections/Statistics'));
const ServicesSection = React.lazy(() => import('../components/sections/ServicesSection'));
const Technologies = React.lazy(() => import('../components/sections/Technologies'));
const PackagesSection = React.lazy(() => import('../components/sections/PackagesSection'));
const AboutSection = React.lazy(() => import('../components/sections/AboutSection'));
const ContactSection = React.lazy(() => import('../components/sections/ContactSection'));

type DeferredSectionProps = {
    children: React.ReactNode;
    minHeight?: number;
    rootMargin?: string;
};

const DeferredSection = ({ children, minHeight = 320, rootMargin = '300px' }: DeferredSectionProps) => {
    const [shouldRender, setShouldRender] = useState(false);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (shouldRender || !triggerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setShouldRender(true);
                    observer.disconnect();
                }
            },
            { root: null, rootMargin, threshold: 0.01 }
        );

        observer.observe(triggerRef.current);
        return () => observer.disconnect();
    }, [rootMargin, shouldRender]);

    return (
        <div ref={triggerRef}>
            {shouldRender ? (
                <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>
                    {children}
                </Suspense>
            ) : (
                <div style={{ minHeight }} aria-hidden="true" />
            )}
        </div>
    );
};

const Home = () => {
    return (
        <main>
            <Hero />
            <DeferredSection minHeight={500}>
                <Statistics />
            </DeferredSection>
            <DeferredSection minHeight={420}>
                <ServicesSection />
            </DeferredSection>
            <DeferredSection minHeight={360}>
                <Technologies />
            </DeferredSection>
            <DeferredSection minHeight={520}>
                <PackagesSection />
            </DeferredSection>
            <DeferredSection minHeight={460}>
                <AboutSection />
            </DeferredSection>
            <DeferredSection minHeight={640} rootMargin="500px">
                <ContactSection />
            </DeferredSection>
        </main>
    );
};

export default Home;
