"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, DollarSign, Loader2, Calendar, ExternalLink, Building } from "lucide-react"
import { toast } from 'sonner'

interface DevelopmentNews {
  id: string
  title: string
  description: string
  source: string
  url: string
  date: string
  category: string
  location?: string
  projectValue?: string
  developer?: string
  status?: string
  imageUrl?: string
}

const STATUSES = [
  'All',
  'Under Construction',
  'Planned',
  'Proposed',
  'Completed'
]

const VALUE_RANGES = [
  { label: 'All', min: undefined, max: undefined },
  { label: 'Under $10M', min: '0', max: '10' },
  { label: '$10M - $50M', min: '10', max: '50' },
  { label: '$50M - $100M', min: '50', max: '100' },
  { label: '$100M - $500M', min: '100', max: '500' },
  { label: '$500M+', min: '500', max: undefined }
]

export default function DevelopmentsPage() {
  const [news, setNews] = useState<DevelopmentNews[]>([])
  const [loading, setLoading] = useState(true)
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [valueRange, setValueRange] = useState<typeof VALUE_RANGES[0]>(VALUE_RANGES[0])

  useEffect(() => {
    fetchNews()
  }, [locationFilter, statusFilter, valueRange])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (locationFilter) params.append('location', locationFilter)
      if (statusFilter !== 'All') params.append('status', statusFilter)
      if (valueRange.min) params.append('minValue', valueRange.min)
      if (valueRange.max) params.append('maxValue', valueRange.max)
      
      const response = await fetch(\`/api/news/developments?\${params.toString()}\`)
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      setNews(data.results)
      toast.success(\`Found \${data.results.length} development projects\`)
    } catch (error) {
      console.error('Error fetching news:', error)
      toast.error('Failed to fetch development updates')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Real Estate Developments
          </h1>
          <p className="text-xl text-gray-400">
            Track new construction projects and real estate developments across the country
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Location</label>
            <Input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-gray-800/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Project Status</label>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="bg-gray-800/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Project Value</label>
            <Select
              value={VALUE_RANGES.findIndex(r => r === valueRange).toString()}
              onValueChange={(value) => setValueRange(VALUE_RANGES[parseInt(value)])}
            >
              <SelectTrigger className="bg-gray-800/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VALUE_RANGES.map((range, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* News Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-12"
            >
              <Loader2 className="h-8 w-8 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="news"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {news.map((item) => (
                <Card
                  key={item.id}
                  className="bg-gray-800/50 backdrop-blur-lg border-gray-700 hover:bg-gray-700/50 transition-colors"
                >
                  <CardContent className="p-6">
                    {item.imageUrl ? (
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video mb-4 bg-gray-700 rounded-lg flex items-center justify-center">
                        <Building className="h-12 w-12 text-gray-500" />
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                          {item.status || 'Development'}
                        </Badge>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(item.date)}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold line-clamp-2">{item.title}</h3>

                      {item.location && (
                        <p className="text-gray-300 flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          {item.location}
                        </p>
                      )}

                      {item.projectValue && (
                        <p className="text-gray-300 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          {item.projectValue}
                        </p>
                      )}

                      {item.developer && (
                        <p className="text-gray-300 flex items-center gap-2">
                          <Building2 className="h-4 w-4 flex-shrink-0" />
                          {item.developer}
                        </p>
                      )}

                      <p className="text-gray-400 line-clamp-3">{item.description}</p>

                      <div className="flex justify-between items-center pt-4">
                        <span className="text-sm text-gray-500">{item.source}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          Read More
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && news.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No development projects found matching your filters
          </div>
        )}
      </div>
    </div>
  )
}
