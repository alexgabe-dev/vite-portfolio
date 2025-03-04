import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award, Rocket, ChevronRight, Code, Palette, Globe } from 'lucide-react';

const About = () => {
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  const teamMembers = [
    {
      name: "Kovács Péter",
      role: "Vezető Fejlesztő",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      description: "10+ év tapasztalat webfejlesztésben"
    },
    {
      name: "Nagy Anna",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      description: "Kreatív design megoldások szakértője"
    },
    {
      name: "Kiss Tamás",
      role: "Marketing Specialista",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      description: "Digital marketing stratégia specialista"
    }
  ];

  const stats = [
    { number: "150+", label: "Sikeres Projekt", icon: Rocket },
    { number: "98%", label: "Elégedett Ügyfél", icon: Users },
    { number: "5+", label: "Év Tapasztalat", icon: Award },
    { number: "24/7", label: "Ügyfélszolgálat", icon: Target }
  ];

  const services = [
    {
      icon: Code,
      title: "Modern Technológiák",
      description: "A legújabb webes technológiákat használjuk a fejlesztés során, hogy ügyfeleink mindig a legjobb megoldást kapják."
    },
    {
      icon: Palette,
      title: "Egyedi Design",
      description: "Minden projektünk egyedileg tervezett, az ügyfél brandjéhez és igényeihez igazítva."
    },
    {
      icon: Globe,
      title: "Nemzetközi Tapasztalat",
      description: "Számos nemzetközi projektben vettünk részt, így széles körű tapasztalattal rendelkezünk."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-24 relative overflow-hidden">
      {/* Modern Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[#ff8f35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-[25%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-24"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          <h1 className="text-5xl font-bold mb-6">
            Ismerd meg a
            <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> csapatunkat</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Szenvedélyes szakemberek csapata, akik elkötelezettek abban, hogy ügyfeleink digitális álmait valósággá váltsák
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-[#1a1a2e]/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 text-center"
              whileHover={{ y: -5, borderColor: '#ff5c35' }}
              transition={{ duration: 0.2 }}>
              <motion.div
                className="w-12 h-12 mx-auto mb-4 bg-[#ff5c35]/20 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 92, 53, 0.3)' }}>
                {React.createElement(stat.icon, { className: "w-6 h-6 text-[#ff5c35]" })}
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.number}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Services Section */}
        <motion.div 
          className="mb-24"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          <h2 className="text-3xl font-bold text-center mb-12">
            Amiben
            <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> kiemelkedünk</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a2e]/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50"
                whileHover={{ y: -5, borderColor: '#ff5c35' }}
                transition={{ duration: 0.2 }}>
                <motion.div
                  className="w-12 h-12 mb-6 bg-[#ff5c35]/20 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 92, 53, 0.3)' }}>
                  {React.createElement(service.icon, { className: "w-6 h-6 text-[#ff5c35]" })}
                </motion.div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          <h2 className="text-3xl font-bold text-center mb-12">
            A csapat
            <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> szakértői</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden"
                whileHover={{ y: -5, borderColor: '#ff5c35' }}
                transition={{ duration: 0.2 }}>
                <div className="aspect-w-4 aspect-h-3">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-[#ff5c35] font-medium mb-3">{member.role}</p>
                  <p className="text-gray-400">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-24 text-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          <h2 className="text-3xl font-bold mb-6">
            Készen állsz a
            <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> következő lépésre?</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Vedd fel velünk a kapcsolatot és beszéljük meg, hogyan tudunk segíteni a projektedben
          </p>
          <motion.button
            className="inline-flex items-center px-8 py-4 bg-[#ff5c35] text-white rounded-lg font-semibold hover:bg-[#ff5c35]/90 transition-colors group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}>
            Kapcsolatfelvétel
            <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 