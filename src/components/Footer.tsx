
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp } from '../utils/animations';

const Footer = () => {
    return (
        <motion.footer
            className="bg-[#0a0a0f] border-t border-gray-800/30 py-12 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <motion.div variants={fadeInUp} className="flex flex-col items-start">
                        <motion.img
                            src="/vizitor-logo.svg"
                            alt="Vizitor Logo"
                            width={64}
                            height={64}
                            className="h-32 w-32 object-contain"
                            loading="lazy"
                            decoding="async"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        />
                        <p className="text-gray-400">Modern megoldások a vállalkozásod számára!</p>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <h4 className="font-semibold mb-4">Szolgáltatások</h4>
                        <ul className="space-y-2">
                            <motion.li whileHover={{ x: 5 }}>
                                <Link to="/szolgaltatasok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Webfejlesztés</Link>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }}>
                                <Link to="/szolgaltatasok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">PPC kampánykezelés</Link>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }}>
                                <Link to="/szolgaltatasok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Automatizálás</Link>
                            </motion.li>
                        </ul>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <h4 className="font-semibold mb-4">Csomagok</h4>
                        <ul className="space-y-2">
                            <motion.li whileHover={{ x: 5 }}>
                                <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Weboldalkészítés</Link>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }}>
                                <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Marketing szolgáltatások</Link>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }}>
                                <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Web karbantartás</Link>
                            </motion.li>
                        </ul>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <h4 className="font-semibold mb-4">Továbbiak</h4>
                        <ul className="space-y-2">
                            <motion.li whileHover={{ x: 5 }}>
                                <Link to="/kapcsolat" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Kapcsolatfelvétel</Link>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }}>
                                <Link to="/adatvedelem" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Adatvédelmi Tájékoztató</Link>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }}>
                                <Link to="/kapcsolat" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Elérhetőségek</Link>
                            </motion.li>
                        </ul>
                    </motion.div>
                </div>
                <motion.div
                    className="mt-12 pt-8 border-t border-gray-800/30 text-center text-gray-400"
                    variants={fadeInUp}>
                    © {new Date().getFullYear()} Vizitor.hu. Minden jog fenntartva.
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;
