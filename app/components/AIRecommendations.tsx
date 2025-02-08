"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type Recommendation = {
  id: number
  title: string
  description: string
  confidence: number
}

type AIRecommendationsProps = {
  searchQuery: string
}

export default function AIRecommendations({ searchQuery }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const mockData: Recommendation[] = [
        { id: 1, title: "Related Contract", description: "A contract with similar terms was found.", confidence: 85 },
        {
          id: 2,
          title: "Policy Update",
          description: "This document may require updates based on recent policy changes.",
          confidence: 72,
        },
        {
          id: 3,
          title: "Potential Duplicate",
          description: "A similar document was detected in another department.",
          confidence: 68,
        },
      ]
      setRecommendations(mockData)
      setLoading(false)
    }

    if (searchQuery) {
      fetchRecommendations()
    }
  }, [searchQuery])

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-glow">AI Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="bg-white/5 border-purple-500/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-purple-300">{rec.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Confidence: {rec.confidence}%</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-black"
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

