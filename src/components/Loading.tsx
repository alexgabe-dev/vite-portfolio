import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
      <motion.div
        className="w-16 h-16 border-4 border-[#ff5c35] border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading; 