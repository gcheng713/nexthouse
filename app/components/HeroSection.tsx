"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import HolographicHouse from "./HolographicHouse"

export default function HeroSection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="hero-background min-h-screen flex flex-col justify-center items-center text-center p-4">
      <motion.h1
        className="text-7xl font-bold mb-4 gradient-text"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Future Estate
      </motion.h1>
      <motion.p
        className="text-xl text-cyan-300 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Experience the future of real estate
      </motion.p>
      <motion.div
        className="w-full max-w-3xl mb-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <HolographicHouse />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <Button
          size="lg"
          className="text-lg px-8 py-6 bg-cyan-500 hover:bg-cyan-600 text-black"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Explore Properties
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-cyan-400 rounded-lg"
              layoutId="button-hover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
            />
          )}
        </Button>
      </motion.div>
    </div>
  )
}

