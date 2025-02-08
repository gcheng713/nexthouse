"use client"

import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Home, MapPin } from "lucide-react"
import { toast } from 'sonner'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox"
import "@reach/combobox/styles.css"

interface Property {
  id: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  lat: number
  lng: number
  type: string
  yearBuilt: number
  photos: string[]
  description: string
}

const mapContainerStyle = {
  width: "100%",
  height: "600px",
}

const libraries = ["places"]

export default function PropertySearchPage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries as any,
  })

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 })
  const [zoom, setZoom] = useState(12)

  const mapRef = useRef<google.maps.Map>()
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const panTo = useCallback(({ lat, lng }: { lat: number; lng: number }) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng })
      mapRef.current.setZoom(14)
    }
  }, [])

  const searchProperties = async (address: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/properties/search?address=${encodeURIComponent(address)}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setProperties(data.properties)
      panTo({
        lat: data.searchLocation.lat,
        lng: data.searchLocation.lng,
      })
      toast.success(`Found ${data.properties.length} properties near ${data.searchLocation.address}`)
    } catch (error) {
      console.error('Error searching properties:', error)
      toast.error('Failed to search properties')
    } finally {
      setLoading(false)
    }
  }

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading maps...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Find Your Dream Home
          </h1>
          <p className="text-xl text-gray-400">
            Search properties by location and explore the neighborhood
          </p>
        </div>

        <div className="mb-8">
          <SearchBox onSelectAddress={searchProperties} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property List */}
          <div className="lg:col-span-1 space-y-6 max-h-[600px] overflow-y-auto">
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
                properties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card
                      className={`bg-gray-800/50 backdrop-blur-lg border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                        selectedProperty?.id === property.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedProperty(property)
                        panTo({ lat: property.lat, lng: property.lng })
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="aspect-video mb-4 relative overflow-hidden rounded-lg">
                          {property.photos[0] ? (
                            <img
                              src={property.photos[0]}
                              alt={property.address}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <Home className="h-12 w-12 text-gray-500" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <p className="text-2xl font-bold">
                              ${property.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {property.address}
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
                            <div>
                              <p className="font-semibold">{property.bedrooms}</p>
                              <p>Beds</p>
                            </div>
                            <div>
                              <p className="font-semibold">{property.bathrooms}</p>
                              <p>Baths</p>
                            </div>
                            <div>
                              <p className="font-semibold">{property.sqft.toLocaleString()}</p>
                              <p>Sq Ft</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {property.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {!loading && properties.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                Search for a location to see available properties
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={zoom}
                center={center}
                onLoad={onMapLoad}
                options={{
                  styles: [
                    {
                      featureType: "all",
                      elementType: "geometry",
                      stylers: [{ color: "#242f3e" }],
                    },
                    {
                      featureType: "all",
                      elementType: "labels.text.stroke",
                      stylers: [{ color: "#242f3e" }],
                    },
                    {
                      featureType: "all",
                      elementType: "labels.text.fill",
                      stylers: [{ color: "#746855" }],
                    },
                    {
                      featureType: "water",
                      elementType: "geometry",
                      stylers: [{ color: "#17263c" }],
                    },
                  ],
                }}
              >
                {properties.map((property) => (
                  <Marker
                    key={property.id}
                    position={{ lat: property.lat, lng: property.lng }}
                    onClick={() => setSelectedProperty(property)}
                    icon={{
                      url: '/marker.svg',
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                  />
                ))}

                {selectedProperty && (
                  <InfoWindow
                    position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
                    onCloseClick={() => setSelectedProperty(null)}
                  >
                    <div className="bg-white p-4 max-w-xs">
                      <h3 className="font-bold mb-2">${selectedProperty.price.toLocaleString()}</h3>
                      <p className="text-sm mb-2">{selectedProperty.address}</p>
                      <p className="text-sm text-gray-600">
                        {selectedProperty.bedrooms} beds • {selectedProperty.bathrooms} baths • {selectedProperty.sqft.toLocaleString()} sqft
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchBox({ onSelectAddress }: { onSelectAddress: (address: string) => void }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['address'],
      componentRestrictions: { country: 'us' },
    },
    debounce: 300,
  })

  return (
    <Combobox
      onSelect={async (address) => {
        setValue(address, false)
        clearSuggestions()
        onSelectAddress(address)
      }}
    >
      <div className="relative">
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="w-full h-12 px-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search for an address..."
        />
        <ComboboxPopover className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <ComboboxList className="py-2">
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption
                  key={place_id}
                  value={description}
                  className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </div>
    </Combobox>
  )
}
