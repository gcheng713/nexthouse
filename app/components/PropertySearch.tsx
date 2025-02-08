"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type PropertySearchProps = {
  onSearch: (searchTerm: string) => void
}

export default function PropertySearch({ onSearch }: PropertySearchProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search for properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-gradient text-white flex-grow"
        />
        <Button type="submit" className="button-gradient">
          Search
        </Button>
      </div>
    </form>
  )
}

