"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"

export default function AboutPage() {
  const { theme } = useTheme()

  const features = [
    "AI-driven property matching",
    "Blockchain-secured transactions",
    "Immersive VR property tours",
    "IoT integration for smart homes",
    "Predictive maintenance analytics",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden">
      <main className="container mx-auto px-4 py-16 relative">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-8 text-center gradient-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About
        </motion.h1>

        <motion.p
          className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          At <span className="text-blue-600 dark:text-blue-400">NextHouse</span>, we're not just adapting to the future
          - we're creating it.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-3xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Our Vision</h2>
                <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                  We're revolutionizing how people interact with properties and redefining the concept of "home" for the
                  digital age. By harnessing cutting-edge technologies, we're creating a seamless, secure, and
                  innovative real estate experience.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-3xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                  Technological Innovation
                </h2>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Join the Revolution</h2>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
            Experience the future of real estate today. Whether you're a buyer, seller, or investor, NextHouse offers
            unparalleled opportunities in the world of digital property.
          </p>
          <Link href="/properties">
            <Button className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              Explore Our Future-Ready Properties
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}

