"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import FloatingHouses from "../components/FloatingHouses"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Home, Search, Key, BarChartIcon as ChartBar, HeadsetIcon as VrHeadset, Shield } from "lucide-react"

const services = [
  {
    title: "Smart Home Integration",
    description: "Seamlessly connect and control your entire home with our cutting-edge IoT solutions.",
    icon: Home,
  },
  {
    title: "AI-Powered Property Matching",
    description: "Find your perfect home faster with our advanced AI algorithms and machine learning techniques.",
    icon: Search,
  },
  {
    title: "Blockchain-Secured Transactions",
    description: "Experience safe and transparent property transactions with our blockchain technology.",
    icon: Key,
  },
  {
    title: "Predictive Market Analytics",
    description: "Stay ahead of the market with our data-driven insights and forecasting tools.",
    icon: ChartBar,
  },
  {
    title: "Virtual Reality Tours",
    description: "Explore properties from anywhere in the world with our immersive VR experiences.",
    icon: VrHeadset,
  },
  {
    title: "Smart Contract Management",
    description: "Streamline your property management with automated, secure smart contracts.",
    icon: Shield,
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen overflow-hidden relative">
      <FloatingHouses />
      <main className="relative container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-8 futuristic-text text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Futuristic Services
        </motion.h1>

        <motion.p
          className="text-xl text-center mb-12 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover how NextHouse is revolutionizing the real estate industry with cutting-edge technology.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="card-gradient hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <service.icon className="w-6 h-6 mr-2 text-blue-500" />
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                  <Button className="mt-4 w-full button-gradient">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button className="button-gradient text-lg px-8 py-3">Schedule a Consultation</Button>
        </motion.div>
      </main>
    </div>
  )
}

