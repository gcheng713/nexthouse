"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

type Property = {
  id: number
  address: string
  price: number
}

export default function SaveFavorites() {
  const [favorites, setFavorites] = useState<Property[]>([])

  useEffect(() => {
    const fetchFavorites = async () => {
      // In a real application, this would be an API call
      const response = await fetch("/api/favorites")
      const data = await response.json()
      setFavorites(data)
    }

    fetchFavorites()
  }, [])

  const toggleFavorite = async (property: Property) => {
    // In a real application, this would be an API call
    const isFavorite = favorites.some((fav) => fav.id === property.id)
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== property.id))
    } else {
      setFavorites([...favorites, property])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorite Properties</CardTitle>
      </CardHeader>
      <CardContent>
        {favorites.map((property) => (
          <div key={property.id} className="flex justify-between items-center mb-2">
            <div>
              <p className="font-semibold">{property.address}</p>
              <p className="text-sm">${property.price.toLocaleString()}</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => toggleFavorite(property)}>
              <Heart className="h-4 w-4 fill-current" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

