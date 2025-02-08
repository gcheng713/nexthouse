'use client';

import { motion } from 'framer-motion';

export default function AnimatedTitle() {
  const letters = "NextHouse".split("");
  
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{
              scale: 1.2,
              rotate: [-5, 5, 0],
              transition: { duration: 0.3 }
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <motion.div
        className="absolute -z-10 w-full h-full blur-3xl opacity-20"
        animate={{
          background: [
            "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(0,0,0,0) 70%)",
            "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(0,0,0,0) 70%)",
            "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(0,0,0,0) 70%)"
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}
