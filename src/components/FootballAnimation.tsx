import React from 'react';
import { motion } from 'framer-motion';

const FootballAnimation: React.FC = () => {
  return (
    <motion.div
      className="absolute text-4xl"
      animate={{
        x: ['0vw', '100vw'],
        y: ['-10vh', '10vh', '-5vh', '5vh', '-10vh'],
        rotate: 720
      }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      🏈
    </motion.div>
  );
};

export default FootballAnimation;