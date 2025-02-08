"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import FloatingHouses from "./components/FloatingHouses"
import ParticleField from "./components/ParticleField"
import AnimatedTitle from "./components/AnimatedTitle"
import { Button } from "@/components/ui/button"
import { LogIn, UserPlus } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Home() {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen overflow-hidden relative">
      <FloatingHouses />
      <ParticleField />
      <main className="relative container mx-auto px-4 py-16">
        <section className="text-center">
          <div className="flex justify-center mb-6">
            <AnimatedTitle />
          </div>
          <motion.p
            className={`text-xl md:text-2xl mb-12 ${theme === "dark" ? "text-cyan-300" : "text-gray-700"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Redefining real estate for the digital age
          </motion.p>
          <motion.div
            className="flex justify-center items-center space-x-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  variant="ghost" 
                  className="group relative overflow-hidden px-8 py-6 text-lg"
                >
                  <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-600 to-indigo-200 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  <div className="relative flex items-center">
                    <motion.div
                      animate={{ rotate: [0, 15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <LogIn className="mr-3 h-5 w-5 text-indigo-400" />
                    </motion.div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 font-semibold">
                      Login
                    </span>
                  </div>
                </Button>
              </motion.div>
            </Link>

            <Link href="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  className={cn(
                    "group relative overflow-hidden px-8 py-6 text-lg",
                    "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600",
                    "text-white shadow-lg shadow-purple-500/30"
                  )}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  <div className="relative flex items-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <UserPlus className="mr-3 h-5 w-5" />
                    </motion.div>
                    <span className="font-semibold">Sign Up</span>
                  </div>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>
            <IntricateHologram />
          </motion.div>
        </section>

        <section className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            { title: "Smart Homes", description: "Seamlessly integrated IoT technology for modern living" },
            { title: "Virtual Tours", description: "Immersive 3D property experiences from anywhere" },
            { title: "AI-Powered Insights", description: "Data-driven decisions for buyers and sellers" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="card-gradient rounded-lg p-6 hover-lift"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  )
}
