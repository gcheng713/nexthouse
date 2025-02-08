"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Sun, DollarSign, Car } from "lucide-react"

export default function PropertyDetails() {
  const [shadeLevel, setShadeLevel] = useState(50)
  const [maintenanceCost, setMaintenanceCost] = useState(1000)
  const [trafficLevel, setTrafficLevel] = useState(30)

  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              <Sun className="mr-2" />
              <h3 className="text-lg font-semibold">Shade Level</h3>
            </div>
            <Slider value={[shadeLevel]} onValueChange={(value) => setShadeLevel(value[0])} max={100} step={1} />
            <p className="mt-1 text-sm">{shadeLevel}% shade coverage</p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <DollarSign className="mr-2" />
              <h3 className="text-lg font-semibold">Maintenance Cost</h3>
            </div>
            <Slider
              value={[maintenanceCost]}
              onValueChange={(value) => setMaintenanceCost(value[0])}
              max={5000}
              step={100}
            />
            <p className="mt-1 text-sm">${maintenanceCost}/year estimated maintenance</p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Car className="mr-2" />
              <h3 className="text-lg font-semibold">Traffic Level</h3>
            </div>
            <Slider value={[trafficLevel]} onValueChange={(value) => setTrafficLevel(value[0])} max={100} step={1} />
            <p className="mt-1 text-sm">{trafficLevel}% traffic congestion</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

