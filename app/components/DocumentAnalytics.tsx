"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type AnalyticsData = {
  category: string
  count: number
}

type DocumentAnalyticsProps = {
  searchQuery: string
}

export default function DocumentAnalytics({ searchQuery }: DocumentAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      // In a real application, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockData: AnalyticsData[] = [
        { category: "Contracts", count: 45 },
        { category: "Reports", count: 30 },
        { category: "Invoices", count: 60 },
        { category: "Policies", count: 25 },
        { category: "Memos", count: 40 },
      ]
      setAnalyticsData(mockData)
    }

    if (searchQuery) {
      fetchAnalytics()
    }
  }, [searchQuery])

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-glow">Document Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData}>
            <XAxis dataKey="category" stroke="#a78bfa" />
            <YAxis stroke="#a78bfa" />
            <Tooltip
              contentStyle={{
                background: "rgba(0, 0, 0, 0.8)",
                border: "1px solid #a78bfa",
                borderRadius: "4px",
              }}
            />
            <Bar dataKey="count" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

