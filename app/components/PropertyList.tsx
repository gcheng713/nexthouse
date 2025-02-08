"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Property = {
  id: number
  address: string
  price: number
  image: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
}

type PropertyListProps = {
  filters: {
    minPrice: number
    maxPrice: number
    bedrooms: number
    neighborhood: string
  }
  onPropertySelect: (property: Property) => void
}

export default function PropertyList({ filters, onPropertySelect }: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          minPrice: filters.minPrice.toString(),
          maxPrice: filters.maxPrice.toString(),
          bedrooms: filters.bedrooms.toString(),
          neighborhood: filters.neighborhood,
        })
        const response = await fetch(`/api/properties?${queryParams}`)
        if (!response.ok) {
          throw new Error("Failed to fetch properties")
        }
        const data = await response.json()
        setProperties(data)
      } catch (err) {
        setError("Failed to load properties. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [filters])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-blue-900">
            <CardHeader>
              <Skeleton className="h-4 w-2/3 bg-blue-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full mb-4 bg-blue-700" />
              <Skeleton className="h-4 w-1/3 bg-blue-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <motion.div
          key={property.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hover-float glow"
          onClick={() => onPropertySelect(property)}
        >
          <Card className="cursor-pointer light-card text-white transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold gradient-text">{property.address}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.address}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <p className="text-2xl font-bold gradient-text">${property.price.toLocaleString()}</p>
              <p className="text-blue-300">
                {property.bedrooms} beds | {property.bathrooms} baths | {property.squareFeet} sqft
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

