
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Send, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Github, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerChildren } from '../../utils/animations';

const ContactSection = () => {
    const location = useLocation();
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

        // Scroll to form on page load - Only if on the Contact page
        if (location.pathname === '/kapcsolat') {
            const timer = setTimeout(() => {
                const formElement = document.getElementById('contact-form');
                if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

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
                    className="text-3xl md:text-4xl font-bold mb-10 md:mb-16"
                    variants={fadeInUp}>
                    Kapcsolatfelvétel
                    <div className="w-16 md:w-24 h-1 bg-[#ff5c35] mt-4"></div>
                </motion.h1>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <motion.div
                        id="contact-form"
                        variants={fadeInUp}
                        className="relative bg-gradient-to-br from-[#181827]/80 to-[#0f0f17]/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl border border-gray-800/50 shadow-2xl overflow-hidden">

                        {/* Decorative glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ff5c35]/20 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-[#ff5c35]/10 rounded-xl">
                                    <Send className="text-[#ff5c35]" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Küldjön üzenetet</h2>
                                    <p className="text-gray-400 text-sm">Válaszolunk 24 órán belül</p>
                                </div>
                            </div>

                            <motion.form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name Input */}
                                <div className="relative group">
                                    <label className="block text-gray-300 mb-2 text-sm font-medium">Név *</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ff5c35] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        </div>
                                        <motion.input
                                            type="text"
                                            name="name"
                                            value={formState.name}
                                            onChange={handleInputChange}
                                            placeholder="Az Ön neve"
                                            className="w-full bg-[#0a0a0f]/60 border border-gray-700/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5c35] focus:ring-2 focus:ring-[#ff5c35]/20 transition-all"
                                            whileFocus={{ scale: 1.01 }}
                                            required
                                            autoComplete="name"
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="relative group">
                                    <label className="block text-gray-300 mb-2 text-sm font-medium">Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ff5c35] transition-colors" size={18} />
                                        <motion.input
                                            type="email"
                                            name="email"
                                            value={formState.email}
                                            onChange={handleInputChange}
                                            placeholder="pelda@email.hu"
                                            className="w-full bg-[#0a0a0f]/60 border border-gray-700/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5c35] focus:ring-2 focus:ring-[#ff5c35]/20 transition-all"
                                            whileFocus={{ scale: 1.01 }}
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                {/* Phone Input */}
                                <div className="relative group">
                                    <label className="block text-gray-300 mb-2 text-sm font-medium">Telefonszám</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ff5c35] transition-colors" size={18} />
                                        <motion.input
                                            type="tel"
                                            name="phone"
                                            value={formState.phone}
                                            onChange={handleInputChange}
                                            placeholder="+36 30 123 4567"
                                            className="w-full bg-[#0a0a0f]/60 border border-gray-700/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5c35] focus:ring-2 focus:ring-[#ff5c35]/20 transition-all"
                                            whileFocus={{ scale: 1.01 }}
                                            autoComplete="tel"
                                        />
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="relative group">
                                    <label className="block text-gray-300 mb-2 text-sm font-medium">Üzenet *</label>
                                    <motion.textarea
                                        name="message"
                                        value={formState.message}
                                        onChange={handleInputChange}
                                        placeholder="Írja le projektjét vagy kérdését..."
                                        rows={5}
                                        className="w-full bg-[#0a0a0f]/60 border border-gray-700/50 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5c35] focus:ring-2 focus:ring-[#ff5c35]/20 transition-all resize-none"
                                        whileFocus={{ scale: 1.01 }}
                                        required
                                        autoComplete="off"
                                    />
                                </div>

                                {/* Privacy Checkbox */}
                                <div className="flex items-start gap-3 p-4 bg-[#0a0a0f]/40 rounded-xl border border-gray-800/30">
                                    <input
                                        type="checkbox"
                                        id="privacy"
                                        checked={formState.privacyAccepted}
                                        onChange={(e) => setFormState(prev => ({
                                            ...prev,
                                            privacyAccepted: e.target.checked
                                        }))}
                                        className="mt-0.5 h-5 w-5 rounded border-gray-700 bg-[#0a0a0f] text-[#ff5c35] focus:ring-[#ff5c35] focus:ring-opacity-25 cursor-pointer"
                                    />
                                    <label htmlFor="privacy" className="text-sm text-gray-400 cursor-pointer">
                                        Elolvastam és elfogadom az{' '}
                                        <Link to="/adatvedelem" className="text-[#ff5c35] hover:underline font-medium">
                                            Adatvédelmi Tájékoztatót
                                        </Link>
                                    </label>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                        {error}
                                    </motion.div>
                                )}

                                {/* Success Message */}
                                {isSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                        <CheckCircle size={18} />
                                        Üzenet sikeresen elküldve! Hamarosan felvesszük Önnel a kapcsolatot.
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading || !formState.privacyAccepted}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${formState.privacyAccepted && !isLoading
                                        ? 'bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] text-white hover:opacity-90 shadow-[#ff5c35]/20'
                                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                    whileHover={{ scale: isLoading || !formState.privacyAccepted ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading || !formState.privacyAccepted ? 1 : 0.98 }}>
                                    {isLoading ? (
                                        <>
                                            <motion.div
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            Küldés folyamatban...
                                        </>
                                    ) : isSubmitted ? (
                                        <>
                                            <CheckCircle size={20} />
                                            Üzenet elküldve!
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Üzenet küldése
                                        </>
                                    )}
                                </motion.button>
                            </motion.form>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    {/* Contact Info - Premium Cards */}
                    <div className="space-y-6">
                        <motion.div variants={fadeInUp} className="mb-4">
                            <h2 className="text-2xl font-bold text-white mb-2">Elérhetőségek</h2>
                            <p className="text-gray-400 text-sm">Keress bizalommal az alábbi csatornákon</p>
                        </motion.div>

                        <div className="grid gap-4">
                            {/* Phone Card */}
                            <motion.a
                                href="tel:+36205180921"
                                variants={fadeInUp}
                                className="group flex items-center gap-5 p-6 bg-[#181827]/50 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-[#ff5c35]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#ff5c35]/5"
                            >
                                <div className="p-4 bg-[#ff5c35]/10 rounded-xl text-[#ff5c35] group-hover:bg-[#ff5c35] group-hover:text-white transition-all duration-300">
                                    <Phone size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Hívj azonnal</p>
                                    <p className="text-lg font-bold text-white group-hover:text-[#ff5c35] transition-colors">+36 20 518 0921</p>
                                </div>
                                <ArrowRight size={20} className="text-gray-700 group-hover:text-[#ff5c35] group-hover:translate-x-1 transition-all" />
                            </motion.a>

                            {/* Email Card */}
                            <motion.a
                                href="mailto:info@vizitor.hu"
                                variants={fadeInUp}
                                className="group flex items-center gap-5 p-6 bg-[#181827]/50 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-[#ff5c35]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#ff5c35]/5"
                            >
                                <div className="p-4 bg-[#ff5c35]/10 rounded-xl text-[#ff5c35] group-hover:bg-[#ff5c35] group-hover:text-white transition-all duration-300">
                                    <Mail size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Email küldése</p>
                                    <p className="text-lg font-bold text-white group-hover:text-[#ff5c35] transition-colors">info@vizitor.hu</p>
                                </div>
                                <ArrowRight size={20} className="text-gray-700 group-hover:text-[#ff5c35] group-hover:translate-x-1 transition-all" />
                            </motion.a>

                            {/* Location Card */}
                            <motion.div
                                variants={fadeInUp}
                                className="group flex items-center gap-5 p-6 bg-[#181827]/50 backdrop-blur-md border border-gray-800/50 rounded-2xl hover:border-gray-700 transition-all duration-300"
                            >
                                <div className="p-4 bg-[#ff5c35]/10 rounded-xl text-[#ff5c35]">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Cím</p>
                                    <p className="text-md font-bold text-white">1136 Budapest, Pannónia utca 14.</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Social Links */}
                        <motion.div variants={fadeInUp} className="pt-6">
                            <p className="text-gray-400 text-sm font-semibold mb-4 ml-1">Kövess a közösségi médiában</p>
                            <div className="flex gap-3">
                                {[
                                    { icon: Facebook, href: "https://facebook.com/vizitor.hu", label: "Facebook" },
                                    { icon: Instagram, href: "https://www.instagram.com/viztorhu", label: "Instagram" },
                                    { icon: Linkedin, href: "https://www.linkedin.com/in/sandor-gabor/", label: "LinkedIn" },
                                    { icon: Github, href: "https://github.com/alexgabe-dev", label: "GitHub" }
                                ].map((social, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-[#181827] border border-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#ff5c35] hover:border-[#ff5c35]/50 transition-all"
                                        whileHover={{ y: -5, scale: 1.1 }}
                                        aria-label={social.label}
                                    >
                                        <social.icon size={22} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Opening Hours */}
                        <motion.div
                            variants={fadeInUp}
                            className="p-6 bg-[#ff5c35]/5 border border-[#ff5c35]/10 rounded-3xl"
                        >
                            <div className="flex items-center gap-3 mb-2 text-[#ff5c35]">
                                <Clock size={20} />
                                <span className="font-bold">Keress bizalommal!</span>
                            </div>
                            <div className="text-gray-400 text-sm space-y-1 ml-8">
                                <p>Hétfő - Péntek: <span className="text-white font-medium">9:00 - 18:00</span></p>
                                <p>Hétvégén: <span className="text-gray-600 font-medium">Zárva</span></p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default ContactSection;
