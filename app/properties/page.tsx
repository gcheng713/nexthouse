"use client"

import { useState, useRef, useCallback } from 'react'
import { useLoadScript, GoogleMap, Marker, StandaloneSearchBox, StreetViewPanorama } from '@react-google-maps/api'
import { Input } from "@/components/ui/input"
import { PropertyInfo } from '@/components/PropertyInfo'

interface Location {
  lat: number
  lng: number
}

export default function PropertiesPage() {
  const [center, setCenter] = useState<Location>({ lat: 37.7749, lng: -122.4194 }) // Default to San Francisco
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null)
  const [currentAddress, setCurrentAddress] = useState<string>('')
  const mapRef = useRef<google.maps.Map | null>(null)
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places'] as any,
  })

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const onSearchBoxLoad = useCallback((ref: google.maps.places.SearchBox) => {
    setSearchBox(ref)
  }, [])

  const onPlacesChanged = useCallback(() => {
    if (searchBox && mapRef.current) {
      const places = searchBox.getPlaces()
      if (places && places.length > 0) {
        const place = places[0]
        if (place.geometry && place.geometry.location) {
          const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
          setCenter(newLocation)
          setCurrentAddress(place.formatted_address || '')
          mapRef.current.panTo(newLocation)
          mapRef.current.setZoom(18)

          // Update Street View position
          if (panoramaRef.current) {
            panoramaRef.current.setPosition(newLocation)
          }
        }
      }
    }
  }, [searchBox])

  if (loadError) {
    return <div>Error loading maps</div>
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      {/* Search Box */}
      <div className="relative z-10">
        <StandaloneSearchBox
          onLoad={onSearchBoxLoad}
          onPlacesChanged={onPlacesChanged}
        >
          <Input
            type="text"
            placeholder="Search for an address..."
            className="w-full"
          />
        </StandaloneSearchBox>
      </div>

      {/* Property Info */}
      {currentAddress && (
        <PropertyInfo address={currentAddress} />
      )}

      {/* Map */}
      <div className="w-full h-[400px]">
        <GoogleMap
          onLoad={onMapLoad}
          zoom={18}
          center={center}
          mapContainerClassName="w-full h-full rounded-lg"
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            scaleControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>

      {/* Street View */}
      <div className="w-full h-[600px]">
        <GoogleMap
          mapContainerClassName="w-full h-full rounded-lg"
          center={center}
          zoom={18}
        >
          <StreetViewPanorama
            position={center}
            visible={true}
            onLoad={(panorama) => {
              panoramaRef.current = panorama
            }}
            options={{
              enableCloseButton: false,
              addressControl: true,
              fullscreenControl: true,
              pov: {
                heading: 0,
                pitch: 0,
              },
            }}
          />
        </GoogleMap>
      </div>
    </div>
  )
}
