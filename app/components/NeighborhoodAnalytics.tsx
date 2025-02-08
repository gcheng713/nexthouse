"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type NeighborhoodData = {
  crimeRate: number
  walkabilityScore: number
  nearbyAmenities: string[]
}

export default function NeighborhoodAnalytics({ neighborhood }: { neighborhood: string }) {
  const [data, setData] = useState<NeighborhoodData | null>(null)

  useEffect(() => {
    const fetchNeighborhoodData = async () => {
      // In a real application, this would be an API call
      const response = await fetch(`/api/neighborhood-data?name=${neighborhood}`)
      const data = await response.json()
      setData(data)
    }

    fetchNeighborhoodData()
  }, [neighborhood])

  if (!data) return <div>Loading neighborhood data...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighborhood Analytics: {neighborhood}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Crime Rate</p>
            <Progress value={data.crimeRate} max={100} />
            <p className="text-sm text-gray-500">
              {data.crimeRate < 30 ? "Low" : data.crimeRate < 70 ? "Medium" : "High"}
            </p>
          </div>
          <div>
            <p className="font-semibold">Walkability Score</p>
            <Progress value={data.walkabilityScore} max={100} />
            <p className="text-sm text-gray-500">{data.walkabilityScore}/100</p>
          </div>
          <div>
            <p className="font-semibold">Nearby Amenities</p>
            <ul className="list-disc pl-5">
              {data.nearbyAmenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

