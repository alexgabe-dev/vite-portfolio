
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, BarChart, Settings, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerChildren } from '../../utils/animations';

const services = [
    {
        icon: <Code size={28} />,
        title: "Webfejlesztés",
        description: "Modern, reszponzív weboldalak készítése, amelyek nem csak jól néznek ki, de hatékonyan konvertálnak.",
        features: [
            "Egyedi weboldal készítés",
            "WordPress fejlesztés",
            "E-commerce megoldások",
            "Weboldal karbantartás"
        ],
        color: "from-blue-500/20 to-purple-500/20"
    },
    {
        icon: <BarChart size={28} />,
        title: "Marketing",
        description: "Átfogó, professzionális digitális marketing stratégiák, amelyek növelik az online láthatóságot és az értékesítést.",
        features: [
            "SEO optimalizálás",
            "PPC kampányok",
            "Social Media Marketing",
            "Email marketing"
        ],
        color: "from-orange-500/20 to-red-500/20"
    },
    {
        icon: <Settings size={28} />,
        title: "Automatizálás",
        description: "Üzleti folyamatok részletes automatizálása, amely időt és erőforrásokatanak szabadít fel vállalkozásod számára.",
        features: [
            "Folyamatautomatizálás",
            "CRM rendszerek",
            "Marketing automatizálás",
            "Chatbot megoldások"
        ],
        color: "from-green-500/20 to-teal-500/20"
    }
];

const ServicesSection = () => {
    return (
        <motion.section
            id="services"
            className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f17] relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#ff5c35]/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#ff5c35]/10 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-16"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}>
                    <motion.h2
                        className="text-4xl sm:text-5xl font-bold mb-6"
                        variants={fadeInUp}>
                        Szolgáltatásaim
                    </motion.h2>
                    <motion.p
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                        variants={fadeInUp}>
                        Fedezd fel átfogó szolgáltatásaimat, amelyek segítenek vállalkozásod digitális növekedésében
                    </motion.p>
                    <div className="w-24 h-1 bg-[#ff5c35] mx-auto mt-6"></div>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-3 gap-8"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}>
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className="group relative"
                            variants={fadeInUp}>
                            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                                style={{ background: `linear-gradient(to bottom right, ${service.color})` }}></div>
                            <div className="relative bg-[#1a1a2e] p-8 rounded-xl border border-gray-800/50 group-hover:border-[#ff5c35]/30 transition-all duration-500">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#ff5c35]/20 to-[#ff5c35]/10 rounded-lg flex items-center justify-center mb-6 text-[#ff5c35] group-hover:scale-110 transition-transform duration-500">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#ff5c35] transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                                    {service.description}
                                </p>
                                <ul className="space-y-3">
                                    {service.features.map((feature, idx) => (
                                        <motion.li
                                            key={idx}
                                            className="flex items-center text-gray-400 group-hover:text-gray-300 cursor-pointer"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            whileHover={{ x: 5 }}
                                            onClick={() => {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}>
                                            <ChevronRight size={16} className="text-[#ff5c35] mr-2" />
                                            {feature}
                                        </motion.li>
                                    ))}
                                </ul>
                                <Link
                                    to="/szolgaltatasok"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="block w-full"
                                >
                                    <motion.button
                                        type="button"
                                        className="mt-8 px-6 py-2 bg-[#1a1a2e] border border-[#ff5c35]/30 text-[#ff5c35] rounded-lg hover:bg-[#ff5c35] hover:text-white transition-all duration-300 w-full"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}>
                                        Részletek
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}>
                <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <motion.button
                        type="button"
                        className="secondary-button inline-flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        Ingyenes konzultációt kérek!
                        <ChevronRight size={20} className="ml-2" />
                    </motion.button>
                </Link>
            </motion.div>
        </motion.section>
    );
};

export default ServicesSection;
