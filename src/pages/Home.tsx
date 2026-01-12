
import React from 'react';
import Hero from '../components/sections/Hero';
import Statistics from '../components/sections/Statistics';
import ServicesSection from '../components/sections/ServicesSection';
import Technologies from '../components/sections/Technologies';
import PackagesSection from '../components/sections/PackagesSection';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';

const Home = () => {
    return (
        <main>
            <Hero />
            <Statistics />
            <ServicesSection />
            <Technologies />
            <PackagesSection />
            <AboutSection />
            <ContactSection />
        </main>
    );
};

export default Home;
