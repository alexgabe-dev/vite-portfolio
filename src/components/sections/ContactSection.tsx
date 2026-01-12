
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Send, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Github } from 'lucide-react';
import { fadeInUp, staggerChildren } from '../../utils/animations';

const ContactSection = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        privacyAccepted: false
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState({
        ip: '',
        device: '',
        browser: ''
    });

    useEffect(() => {
        // Collect device and browser information
        const deviceInfo = {
            device: `${navigator.platform} - ${navigator.userAgent.match(/\((.*?)\)/)?.[1] || 'Unknown'}`,
            browser: `${navigator.userAgent.match(/(Chrome|Safari|Firefox|Edge|MSIE|Trident)\/[\d.]+/)?.[0] || 'Unknown'}`
        };
        setUserInfo(prev => ({ ...prev, ...deviceInfo }));

        // Get IP address
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                setUserInfo(prev => ({ ...prev, ip: data.ip }));
            })
            .catch(error => {
                console.error('Error fetching IP:', error);
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formState.privacyAccepted) {
            setError('Kérjük fogadja el az adatvédelmi tájékoztatót!');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);

            // Add additional fields to the form data
            formData.append('_subject', 'Új érdeklődő - vizitor.hu');
            formData.append('_replyto', formState.email);

            // Add user information
            formData.append('ip_address', userInfo.ip);
            formData.append('device_info', userInfo.device);
            formData.append('browser_info', userInfo.browser);

            // Add source information
            formData.append('source', 'footer_form');

            const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
            if (!formspreeId) {
                console.error('Formspree ID is missing');
                setError('Configuration error');
                setIsLoading(false);
                return;
            }

            const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                setError('Form submission failed');
                return;
            }

            setIsSubmitted(true);
            setFormState({
                name: '',
                email: '',
                phone: '',
                message: '',
                privacyAccepted: false
            });

            setTimeout(() => setIsSubmitted(false), 3000);
        } catch (err: any) {
            console.error('Form submission error:', err);
            setError('Hiba történt az üzenet küldése közben. Kérjük próbálja újra később.');
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.section
            id="kapcsolat"
            className="py-20 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    className="text-4xl font-bold mb-16"
                    variants={fadeInUp}>
                    Kapcsolatfelvétel
                    <div className="w-24 h-1 bg-[#ff5c35] mt-4"></div>
                </motion.h1>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        variants={fadeInUp}
                        className="bg-[#0f0f17] p-8 rounded-lg">
                        <h2 className="text-2xl font-bold mb-6">Küldjön üzenetet</h2>
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Név *</label>
                                <motion.input
                                    type="text"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleInputChange}
                                    placeholder="Az Ön neve"
                                    className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                                    whileFocus={{ scale: 1.01 }}
                                    required
                                    autoComplete="name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Email *</label>
                                <motion.input
                                    type="email"
                                    name="email"
                                    value={formState.email}
                                    onChange={handleInputChange}
                                    placeholder="pelda@email.hu"
                                    className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                                    whileFocus={{ scale: 1.01 }}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Telefon</label>
                                <motion.input
                                    type="tel"
                                    name="phone"
                                    value={formState.phone}
                                    onChange={handleInputChange}
                                    placeholder="+36 30 123 4567"
                                    className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                                    whileFocus={{ scale: 1.01 }}
                                    autoComplete="tel"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Üzenet *</label>
                                <motion.textarea
                                    name="message"
                                    value={formState.message}
                                    onChange={handleInputChange}
                                    placeholder="Írja le kérdését vagy projektjét..."
                                    rows={5}
                                    className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors resize-none"
                                    whileFocus={{ scale: 1.01 }}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <motion.input
                                    type="checkbox"
                                    id="privacy"
                                    checked={formState.privacyAccepted}
                                    onChange={(e) => setFormState(prev => ({
                                        ...prev,
                                        privacyAccepted: e.target.checked
                                    }))}
                                    className="h-4 w-4 rounded border-gray-800 bg-[#0a0a0f] text-[#ff5c35] focus:ring-[#ff5c35] focus:ring-opacity-25"
                                />
                                <label htmlFor="privacy" className="text-sm text-gray-400">
                                    Elolvastam és elfogadom az <Link to="/adatvedelem" className="text-[#ff5c35] hover:underline">adatvédelmi tájékoztatót</Link>
                                </label>
                            </div>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </motion.div>
                            )}
                            {isSubmitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg text-sm">
                                    Üzenet sikeresen elküldve! Hamarosan felvesszük Önnel a kapcsolatot.
                                </motion.div>
                            )}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full inline-flex items-center justify-center px-6 py-4 bg-[#ff5c35] text-white rounded-lg font-semibold transition-colors group text-sm md:text-base ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#ff5c35]/90'
                                    }`}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        Küldés folyamatban...
                                    </>
                                ) : isSubmitted ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Üzenet elküldve!
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Üzenet küldése
                                    </>
                                )}
                            </motion.button>
                        </motion.form>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={fadeInUp}>
                        <h2 className="text-2xl font-bold mb-6 mt-12">Elérhetőségeink</h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Email</h3>
                                <motion.a
                                    href="mailto:info@vizitor.hu"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="text-gray-400 hover:text-white flex items-center"
                                    whileHover={{ x: 5 }}>
                                    <Mail className="mr-2 text-[#ff5c35]" size={20} />
                                    info@vizitor.hu
                                </motion.a>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Telefon</h3>
                                <motion.a
                                    href="tel:+36205180921"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="text-gray-400 hover:text-white flex items-center"
                                    whileHover={{ x: 5 }}>
                                    <Phone className="mr-2 text-[#ff5c35]" size={20} />
                                    +36 20 518 0921
                                </motion.a>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Cím</h3>
                                <motion.div
                                    className="text-gray-400 flex items-center"
                                    whileHover={{ x: 5 }}>
                                    <MapPin className="mr-2 text-[#ff5c35]" size={20} />
                                    Pannónia utca 14., Budapest, 1136
                                </motion.div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Kövess engem</h3>
                                <div className="flex space-x-4">
                                    <motion.a
                                        href="https://facebook.com/vizitor.hu"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                                        whileHover={{ y: -5 }}
                                        aria-label="Kövessen minket Facebookon">
                                        <Facebook size={20} />
                                    </motion.a>
                                    <motion.a
                                        href="https://www.instagram.com/viztorhu"
                                        className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                                        whileHover={{ y: -5 }}
                                        aria-label="Kövessen engem Instagramon">
                                        <Instagram size={20} />
                                    </motion.a>
                                    <motion.a
                                        href="https://www.linkedin.com/in/sandor-gabor/"
                                        className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                                        whileHover={{ y: -5 }}
                                        aria-label="Kövessen engem LinkedInen">
                                        <Linkedin size={20} />
                                    </motion.a>
                                    <motion.a
                                        href="https://github.com/alexgabe-dev"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                                        whileHover={{ y: -5 }}
                                        aria-label="Kövessen engem GitHubon">
                                        <Github size={20} />
                                    </motion.a>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Keress bizalommal!</h3>
                                <div className="space-y-2 text-gray-400">
                                    <p>Hétfő - Péntek: 9:00 - 18:00</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default ContactSection;
