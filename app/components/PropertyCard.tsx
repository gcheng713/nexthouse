import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type PropertyCardProps = {
  property: {
    id: number
    title: string
    price: number
    bedrooms: number
    bathrooms: number
    sqft: number
    image: string
    features: string[]
  }
  index: number
}

export default function PropertyCard({ property, index }: PropertyCardProps) {
  return (
    <motion.div
      className="card-gradient rounded-lg overflow-hidden hover-lift"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Image
        src={property.image || "/placeholder.svg"}
        alt={property.title}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 futuristic-text">{property.title}</h3>
        <p className="text-gray-600 mb-2">${property.price.toLocaleString()}</p>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-1">Features:</h4>
          <ul className="text-sm text-gray-600">
            {property.features.map((feature, index) => (
              <li key={index} className="inline-block mr-2 mb-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <Button className="w-full button-gradient">View Details</Button>
      </div>
    </motion.div>
  )
}

