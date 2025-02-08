"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type Property = {
  id: number
  address: string
  price: number
  squareFeet: number
}

export default function ComparativeMarketAnalysis({ propertyId }: { propertyId: number }) {
  const [comparableProperties, setComparableProperties] = useState<Property[]>([])

  useEffect(() => {
    const fetchComparableProperties = async () => {
      // In a real application, this would be an API call
      const response = await fetch(`/api/comparable-properties?id=${propertyId}`)
      const data = await response.json()
      setComparableProperties(data)
    }

    fetchComparableProperties()
  }, [propertyId])

  const chartData = comparableProperties.map((property) => ({
    address: property.address.split(" ")[0], // Shortening address for chart
    price: property.price,
    pricePerSqFt: Math.round(property.price / property.squareFeet),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparative Market Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="address" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#8884d8" name="Price" />
            <Bar dataKey="pricePerSqFt" fill="#82ca9d" name="Price per Sq Ft" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

