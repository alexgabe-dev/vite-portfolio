import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Handshake, Target, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerChildren } from '../../utils/animations';

const values = [
    {
        icon: <Lightbulb className="w-8 h-8 text-[#ff5c35]" />,
        title: 'Innováció',
        description: 'Folyamatosan keresem az új technológiai megoldásokat.',
        gradient: 'from-blue-500/20 to-purple-500/20',
        features: ['Új technológiák', 'Kreatív megoldások', 'Folyamatos fejlődés']
    },
    {
        icon: <Handshake className="w-8 h-8 text-[#ff5c35]" />,
        title: 'Megbízhatóság',
        description: 'Amit megígérek, azt időben és kiváló minőségben teljesítem.',
        gradient: 'from-orange-500/20 to-red-500/20',
        features: ['Pontos határidők', 'Minőségi szolgáltatás', 'Megbízható partner']
    },
    {
        icon: <Target className="w-8 h-8 text-[#ff5c35]" />,
        title: 'Eredményorientáltság',
        description: 'A mérhető, valós üzleti eredmények elérése a célom.',
        gradient: 'from-green-500/20 to-teal-500/20',
        features: ['Mérhető eredmények', 'Üzleti növekedés', 'ROI fókusz']
    }
];

const AboutSection = () => {
    return (
        <motion.section
            id="rolam"
            className="py-16 md:py-20 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="max-w-7xl mx-auto">
                <motion.h1 className="text-3xl md:text-4xl font-bold mb-10 md:mb-16" variants={fadeInUp}>
                    Rólam
                    <div className="w-24 h-1 bg-[#ff5c35] mt-4"></div>
                </motion.h1>

                <motion.div
                    className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-14 md:mb-20"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}>
                    <motion.div variants={fadeInUp}>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Történetem</h2>
                        <p className="text-gray-400 mb-5 text-sm md:text-base leading-relaxed">
                            A <a href="https://vizitor.hu" className="text-[#ff5c35] hover:underline">vizitor.hu</a>-t azért hoztam létre,
                            mert felismertem, hogy a magyar vállalkozásoknak szükségük van egy megbízható digitális partnerre.
                        </p>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                            Olyan megoldásokat készítek, amelyek nemcsak technológiailag korszerűek, hanem valódi üzleti értéket is teremtenek.
                        </p>
                    </motion.div>
                    <motion.div className="relative h-[260px] md:h-[400px]" variants={fadeInUp}>
                        <motion.div className="absolute right-0 w-full h-full bg-[#1a1a2e] rounded-xl overflow-hidden" whileHover={{ scale: 1.01 }}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5c35]/20 to-transparent"></div>
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-50"></div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="mb-12"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}>
                    <motion.h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center" variants={fadeInUp}>
                        Értékeink
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {values.map((value, index) => (
                            <motion.article key={index} className="group relative" variants={fadeInUp}>
                                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl ${value.gradient}`}></div>
                                <div className="relative bg-[#1a1a2e] p-5 md:p-8 rounded-xl border border-gray-800/50 group-hover:border-[#ff5c35]/30 transition-all duration-500">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#ff5c35]/20 to-[#ff5c35]/10 rounded-lg flex items-center justify-center mb-4 md:mb-6 text-[#ff5c35] group-hover:scale-110 transition-transform duration-500">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-[#ff5c35] transition-colors duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-400 mb-5 md:mb-6 text-sm md:text-base group-hover:text-gray-300 transition-colors duration-300">
                                        {value.description}
                                    </p>
                                    <ul className="space-y-2.5">
                                        {value.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-gray-400 text-sm md:text-base group-hover:text-gray-300">
                                                <ChevronRight size={16} className="text-[#ff5c35] mr-2" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default AboutSection;
