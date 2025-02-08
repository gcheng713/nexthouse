import { NextResponse } from 'next/server'
import { Client } from '@googlemaps/google-maps-services-js'

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || ''
const RADIUS_MILES = 10 // Search radius in miles

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

// Initialize Google Maps client
const googleMapsClient = new Client({})

async function geocodeAddress(address: string) {
  try {
    const response = await googleMapsClient.geocode({
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY
      }
    })

    if (response.data.results.length === 0) {
      throw new Error('Address not found')
    }

    const location = response.data.results[0].geometry.location
    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress: response.data.results[0].formatted_address
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    throw error
  }
}

async function searchNearbyProperties(lat: number, lng: number) {
  try {
    // Convert radius from miles to meters for Google Places API
    const radiusMeters = RADIUS_MILES * 1609.34

    const response = await googleMapsClient.placesNearby({
      params: {
        location: { lat, lng },
        radius: radiusMeters,
        type: 'real_estate_agency', // This will find real estate related places
        key: GOOGLE_MAPS_API_KEY
      }
    })

    // Get details for each place
    const properties = await Promise.all(
      response.data.results.map(async (place) => {
        try {
          const details = await googleMapsClient.placeDetails({
            params: {
              place_id: place.place_id,
              fields: ['name', 'formatted_address', 'photos', 'geometry', 'price_level', 'rating', 'website'],
              key: GOOGLE_MAPS_API_KEY
            }
          })

          const photoUrls = details.data.result.photos?.map(photo => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
          ) || []

          // Generate some random property details since Places API doesn't provide real estate specific data
          return {
            id: place.place_id,
            address: details.data.result.formatted_address || '',
            price: Math.floor(Math.random() * 500000) + 200000, // Random price between 200k and 700k
            bedrooms: Math.floor(Math.random() * 4) + 2, // 2-5 bedrooms
            bathrooms: Math.floor(Math.random() * 3) + 1, // 1-3 bathrooms
            sqft: Math.floor(Math.random() * 2000) + 1000, // 1000-3000 sqft
            lat: details.data.result.geometry?.location.lat || 0,
            lng: details.data.result.geometry?.location.lng || 0,
            type: ['Single Family', 'Condo', 'Townhouse'][Math.floor(Math.random() * 3)],
            yearBuilt: Math.floor(Math.random() * 50) + 1970, // 1970-2020
            photos: photoUrls,
            description: `Beautiful ${Math.floor(Math.random() * 4) + 2} bedroom home in a great neighborhood. Features include modern amenities, spacious layout, and convenient location.`
          }
        } catch (error) {
          console.error('Error fetching place details:', error)
          return null
        }
      })
    )

    return properties.filter(Boolean) as Property[]
  } catch (error) {
    console.error('Error searching nearby properties:', error)
    throw error
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    
    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    // 1. Geocode the address to get coordinates
    const { lat, lng, formattedAddress } = await geocodeAddress(address)

    // 2. Search for properties near the coordinates
    const properties = await searchNearbyProperties(lat, lng)

    return NextResponse.json({
      searchLocation: {
        address: formattedAddress,
        lat,
        lng
      },
      properties
    })
  } catch (error) {
    console.error('Property search error:', error)
    return NextResponse.json(
      { error: 'Failed to search properties' },
      { status: 500 }
    )
  }
}
