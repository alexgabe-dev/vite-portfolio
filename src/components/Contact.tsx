import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ArrowRight, MessageSquare, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Contact = () => {
  const location = useLocation();
  const isFromPromotion = location.state?.fromPromotion || false;
  const isFromFooter = location.state?.fromFooter || false;
  
  // Add effect to scroll to form when coming from promotion or footer
  useEffect(() => {
    if (isFromPromotion || isFromFooter) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isFromPromotion, isFromFooter]);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    privacyAccepted: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<'form' | 'map'>('form');
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

  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
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
      if (isFromPromotion) {
        formData.append('source', 'promotion_popup');
        formData.append('promotion_request', 'true');
        formData.append('discount_applied', '20%');
      } else if (isFromFooter) {
        formData.append('source', 'footer_form');
      } else {
        formData.append('source', 'contact_page');
      }
      
      const response = await fetch('https://formspree.io/f/xvgkpzen', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      setIsSubmitted(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        privacyAccepted: false
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError('Hiba történt az üzenet küldése közben. Kérjük próbálja újra később.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Címünk",
      details: ["1234 Budapest", "Példa utca 123."],
      action: {
        text: "Útvonaltervezés",
        link: "https://goo.gl/maps/your-location"
      }
    },
    {
      icon: Phone,
      title: "Telefonszám",
      details: ["+36 30 123 4567", "+36 1 123 4567"],
      action: {
        text: "Hívás most",
        link: "tel:+36301234567"
      }
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@weboldal.hu", "support@weboldal.hu"],
      action: {
        text: "Email küldése",
        link: "mailto:info@weboldal.hu"
      }
    },
    {
      icon: Clock,
      title: "Nyitvatartás",
      details: ["H-P: 9:00 - 17:00", "Hétvégén: Zárva"],
      action: {
        text: "Időpontfoglalás",
        link: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-28 pb-12 md:py-24 relative overflow-hidden">
      {/* Modern Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ff8f35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-[25%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-32 md:top-24 left-4 right-4 z-[9999] bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 mx-auto max-w-lg">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm md:text-base text-center">Köszönjük megkeresését! Hamarosan felvesszük Önnel a kapcsolatot.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-32 md:top-24 left-4 right-4 z-[9999] bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 mx-auto max-w-lg">
              <X className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm md:text-base text-center">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div 
          className="text-center mb-8 md:mb-16"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Lépjen
            <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> kapcsolatba </span>
            velünk
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Keressen minket bizalommal! Szakértő csapatunk <span className="text-white font-semibold">15 percen belül</span> válaszol megkeresésére
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Form Section - Now 2 columns wide */}
          <motion.div
            className="md:col-span-2 bg-[#1a1a2e]/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-800/50"
            variants={fadeInUp}
            initial="initial"
            animate="animate">
            <form 
              onSubmit={handleSubmit} 
              className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                    Név *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff5c35] transition-colors text-white text-sm md:text-base"
                    required
                    placeholder="Az Ön neve"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff5c35] transition-colors text-white text-sm md:text-base"
                    required
                    placeholder="pelda@email.hu"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                  Telefonszám
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff5c35] transition-colors text-white text-sm md:text-base"
                  placeholder="+36 30 123 4567"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Tárgy *</label>
                <motion.input 
                  type="text" 
                  name="subject"
                  value={formState.subject}
                  onChange={handleInputChange}
                  placeholder="Üzenet tárgya"
                  className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                  whileFocus={{ scale: 1.01 }}
                  required
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
                />
              </div>

              {/* Privacy Policy Checkbox */}
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

              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full inline-flex items-center justify-center px-6 py-4 bg-[#ff5c35] text-white rounded-lg font-semibold transition-colors group text-sm md:text-base ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#ff5c35]/90'
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
                    Ingyenes ajánlatkérés
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info Section - Now in a single column */}
          <motion.div
            className="space-y-4"
            variants={fadeInUp}
            initial="initial"
            animate="animate">
            {/* Quick Contact Buttons */}
            <motion.a
              href="tel:+36301234567"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="block w-full bg-[#1a1a2e]/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-[#ff5c35] transition-all group"
              whileHover={{ y: -5 }}>
              <div className="flex items-center space-x-4">
                <div className="bg-[#ff5c35]/20 p-3 rounded-xl group-hover:bg-[#ff5c35]/30 transition-colors">
                  <Phone className="w-6 h-6 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Azonnali kapcsolat</h3>
                  <p className="text-gray-400">+36 30 123 4567</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#ff5c35] ml-auto transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            <motion.a
              href="mailto:info@weboldal.hu"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="block w-full bg-[#1a1a2e]/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-[#ff5c35] transition-all group"
              whileHover={{ y: -5 }}>
              <div className="flex items-center space-x-4">
                <div className="bg-[#ff5c35]/20 p-3 rounded-xl group-hover:bg-[#ff5c35]/30 transition-colors">
                  <Mail className="w-6 h-6 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email küldése</h3>
                  <p className="text-gray-400">info@weboldal.hu</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#ff5c35] ml-auto transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            <motion.a
              href="https://goo.gl/maps/your-location"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#1a1a2e]/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-[#ff5c35] transition-all group"
              whileHover={{ y: -5 }}>
              <div className="flex items-center space-x-4">
                <div className="bg-[#ff5c35]/20 p-3 rounded-xl group-hover:bg-[#ff5c35]/30 transition-colors">
                  <MapPin className="w-6 h-6 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Címünk</h3>
                  <p className="text-gray-400">1234 Budapest, Példa utca 123.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#ff5c35] ml-auto transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            <motion.div
              className="block w-full bg-[#1a1a2e]/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50"
              whileHover={{ y: -5 }}>
              <div className="flex items-center space-x-4">
                <div className="bg-[#ff5c35]/20 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Nyitvatartás</h3>
                  <p className="text-gray-400">H-P: 9:00 - 17:00</p>
                  <p className="text-gray-400">Hétvégén: Zárva</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 