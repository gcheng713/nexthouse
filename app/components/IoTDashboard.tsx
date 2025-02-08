"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplets, Wind, Sun } from "lucide-react"

type IoTData = {
  temperature: number
  humidity: number
  airQuality: number
  lightLevel: number
}

export default function IoTDashboard() {
  const [iotData, setIotData] = useState<IoTData | null>(null)

  useEffect(() => {
    // In a real application, this would be a WebSocket connection or an API call
    const fetchIoTData = () => {
      // Simulating IoT data
      setIotData({
        temperature: Math.round(Math.random() * 15 + 15), // 15-30°C
        humidity: Math.round(Math.random() * 60 + 30), // 30-90%
        airQuality: Math.round(Math.random() * 100), // 0-100 (higher is better)
        lightLevel: Math.round(Math.random() * 1000), // 0-1000 lux
      })
    }

    fetchIoTData()
    const interval = setInterval(fetchIoTData, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (!iotData) return <div>Loading IoT data...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Home Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-6 w-6 text-red-500" />
            <span>{iotData.temperature}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-blue-500" />
            <span>{iotData.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-6 w-6 text-green-500" />
            <span>{iotData.airQuality}/100</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sun className="h-6 w-6 text-yellow-500" />
            <span>{iotData.lightLevel} lux</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

