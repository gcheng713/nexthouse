"use client"

import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function PredictiveAnalytics() {
  const [forecastData, setForecastData] = useState<number[]>([])

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchForecastData = async () => {
      // Simulating API call with random data
      const data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100000) + 200000)
      setForecastData(data)
    }

    fetchForecastData()
  }, [])

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Predicted Property Value",
        data: forecastData,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "12 Month Property Value Forecast",
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  )
}

