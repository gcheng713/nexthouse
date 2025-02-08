"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Share2 } from "lucide-react"

type Property = {
  id: number
  address: string
  price: number
  image: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  yearBuilt: number
  neighborhood: string
  schools: string[]
  amenities: string[]
  floorPlan: string
  reviews: { id: number; user: string; rating: number; comment: string }[]
}

export default function PropertyDetail() {
  const [property, setProperty] = useState<Property | null>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchProperty = async () => {
      const res = await fetch(`/api/properties/${id}`)
      const data = await res.json()
      setProperty(data)
    }
    fetchProperty()
  }, [id])

  if (!property) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{property.address}</CardTitle>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold">${property.price.toLocaleString()}</p>
          <div>
            <Button variant="outline" size="icon" className="mr-2">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.address}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="neighborhood">Neighborhood</TabsTrigger>
            <TabsTrigger value="floorPlan">Floor Plan</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="grid grid-cols-2 gap-4">
              <p>Bedrooms: {property.bedrooms}</p>
              <p>Bathrooms: {property.bathrooms}</p>
              <p>Square Feet: {property.squareFeet}</p>
              <p>Year Built: {property.yearBuilt}</p>
            </div>
            <h3 className="font-bold mt-4 mb-2">Amenities</h3>
            <ul className="list-disc pl-5">
              {property.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="neighborhood">
            <p>Neighborhood: {property.neighborhood}</p>
            <h3 className="font-bold mt-4 mb-2">Nearby Schools</h3>
            <ul className="list-disc pl-5">
              {property.schools.map((school, index) => (
                <li key={index}>{school}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="floorPlan">
            <img src={property.floorPlan || "/placeholder.svg"} alt="Floor Plan" className="w-full h-auto" />
          </TabsContent>
          <TabsContent value="reviews">
            {property.reviews.map((review) => (
              <div key={review.id} className="mb-4">
                <div className="flex items-center mb-2">
                  <p className="font-bold mr-2">{review.user}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

