import { NextResponse } from "next/server"

const properties = [
  {
    id: 1,
    address: "123 Future St",
    price: 1000000,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2000,
    yearBuilt: 2020,
    neighborhood: "TechVille",
    schools: ["Future Elementary", "Innovation High"],
    amenities: ["Smart Home System", "Solar Panels", "EV Charging"],
    floorPlan: "/placeholder.svg?height=400&width=600",
    reviews: [
      { id: 1, user: "John Doe", rating: 4, comment: "Great property, very futuristic!" },
      { id: 2, user: "Jane Smith", rating: 5, comment: "Amazing smart home features." },
    ],
  },
  {
    id: 2,
    address: "456 Innovation Ave",
    price: 1500000,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
    yearBuilt: 2022,
    neighborhood: "Innovation District",
    schools: ["Innovation Elementary", "Tech High"],
    amenities: ["Smart Home System", "Pool", "Gym"],
    floorPlan: "/placeholder.svg?height=400&width=600",
    reviews: [{ id: 3, user: "Alice Johnson", rating: 4, comment: "Spacious and modern." }],
  },
  {
    id: 3,
    address: "789 Tech Blvd",
    price: 2000000,
    image: "/placeholder.svg?height=200&width=300",
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3000,
    yearBuilt: 2023,
    neighborhood: "Tech Center",
    schools: ["Tech Elementary", "Future High"],
    amenities: ["Smart Home System", "Home Theater", "Office"],
    floorPlan: "/placeholder.svg?height=400&width=600",
    reviews: [{ id: 4, user: "Bob Williams", rating: 5, comment: "Excellent location and amenities." }],
  },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const minPrice = Number(searchParams.get("minPrice")) || 0
  const maxPrice = Number(searchParams.get("maxPrice")) || Number.POSITIVE_INFINITY
  const bedrooms = Number(searchParams.get("bedrooms")) || 0
  const neighborhood = searchParams.get("neighborhood")

  const filteredProperties = properties.filter(
    (property) =>
      property.price >= minPrice &&
      property.price <= maxPrice &&
      property.bedrooms >= bedrooms &&
      (!neighborhood || property.neighborhood === neighborhood),
  )

  return NextResponse.json(filteredProperties)
}

