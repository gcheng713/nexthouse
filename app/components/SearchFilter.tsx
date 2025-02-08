"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SearchFilterProps = {
  onSearch: (filters: SearchFilters) => void
}

type SearchFilters = {
  minPrice: number
  maxPrice: number
  bedrooms: number
  neighborhood: string
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 1000000,
    bedrooms: 0,
    neighborhood: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 title-gradient">Search Properties</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minPrice" className="text-purple-300">
              Min Price
            </Label>
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleChange}
              className="input-gradient text-white"
            />
          </div>
          <div>
            <Label htmlFor="maxPrice" className="text-purple-300">
              Max Price
            </Label>
            <Input
              id="maxPrice"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleChange}
              className="input-gradient text-white"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="bedrooms" className="text-purple-300">
            Bedrooms
          </Label>
          <Select onValueChange={(value) => handleSelectChange("bedrooms", value)}>
            <SelectTrigger className="input-gradient text-white">
              <SelectValue placeholder="Select bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="neighborhood" className="text-purple-300">
            Neighborhood
          </Label>
          <Input
            id="neighborhood"
            name="neighborhood"
            value={filters.neighborhood}
            onChange={handleChange}
            className="input-gradient text-white"
          />
        </div>
        <Button type="submit" className="w-full button-gradient hover:opacity-90 transition-opacity">
          Search
        </Button>
      </form>
    </div>
  )
}

