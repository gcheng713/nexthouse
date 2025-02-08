"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Property = {
  id: number
  address: string
  price: number
  type: string
}

type DocumentFinderProps = {
  onSearch: (query: string) => void
  isLoaded: boolean
}

export default function DocumentFinder({ onSearch, isLoaded }: DocumentFinderProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    setIsSearching(true)
    onSearch(searchTerm)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const mockProperties: Property[] = [
      { id: 1, address: "123 Future St", price: 1000000, type: "Smart Home" },
      { id: 2, address: "456 Tech Ave", price: 1200000, type: "Eco-Friendly" },
      { id: 3, address: "789 Innovation Blvd", price: 950000, type: "VR-Ready" },
    ]
    setProperties(mockProperties)
    setIsSearching(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center futuristic-text">
          {isLoaded ? (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              Property Finder
            </motion.span>
          ) : (
            <motion.span
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              ⌂
            </motion.span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex space-x-2 mb-6">
                <Input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-gradient text-white"
                />
                <Button onClick={handleSearch} className="button-gradient" disabled={isSearching}>
                  {isSearching ? (
                    <motion.span
                      className="inline-block"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      ⌛
                    </motion.span>
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
              <div className="space-y-4 mt-6">
                <AnimatePresence>
                  {properties.map((property) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-green-900/20 rounded-md hover:bg-green-800/30 transition-colors duration-300 hover:shadow-lg hover:shadow-green-500/20"
                    >
                      <h3 className="font-semibold text-green-300">{property.address}</h3>
                      <p className="text-sm text-green-400">
                        Type: {property.type} | Price: ${property.price.toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

