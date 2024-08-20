import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team } from '../types';

interface DramaticRevealProps {
  teams: Team[];
  currentIndex: number;
  isRevealing: boolean;
}

const DramaticReveal: React.FC<DramaticRevealProps> = ({ teams, currentIndex, isRevealing }) => {
  return (
    <div className="flex justify-center items-center h-64 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg">
      <AnimatePresence>
        {isRevealing && currentIndex < teams.length && (
          <motion.div
            key={teams[currentIndex].id}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, y: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3, times: [0, 0.5, 1] }}
            >
              {teams[currentIndex].name}
            </motion.h2>
            <motion.p 
              className="text-xl text-yellow-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Draft Position: {teams.length - currentIndex}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DramaticReveal;