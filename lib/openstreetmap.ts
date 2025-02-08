import { Property, PropertyHistory } from '@/types/property';

const OSM_OVERPASS_API = 'https://overpass-api.de/api/interpreter';

interface OSMNode {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

interface OSMWay {
  id: number;
  nodes: number[];
  tags: Record<string, string>;
}

interface OSMResponse {
  elements: (OSMNode | OSMWay)[];
}

export async function getPropertyData(address: string): Promise<Property | null> {
  try {
    // First, get the coordinates for the address using Nominatim
    const encodedAddress = encodeURIComponent(address);
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'FuturisticRealEstate/1.0'
        }
      }
    );

    const nominatimData = await nominatimResponse.json();
    console.log('Nominatim response:', nominatimData);
    
    if (!nominatimData || nominatimData.length === 0) {
      console.error('Address not found');
      return null;
    }

    const { lat, lon } = nominatimData[0];

    // Now query Overpass API for building details
    const query = `
      [out:json][timeout:25];
      (
        way["building"](around:50,${lat},${lon});
        relation["building"](around:50,${lat},${lon});
      );
      out body;
      >;
      out skel qt;
    `;

    const overpassResponse = await fetch(OSM_OVERPASS_API, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const osmData: OSMResponse = await overpassResponse.json();
    console.log('OSM response:', osmData);
    
    if (!osmData.elements || osmData.elements.length === 0) {
      console.error('No building data found');
      return null;
    }

    // Find the most relevant building
    const building = osmData.elements.find(element => 
      'tags' in element && element.tags.building
    );

    if (!building || !('tags' in building)) {
      return null;
    }

    // Extract address components from Nominatim data
    const addressParts = nominatimData[0].display_name.split(', ');
    const zipCode = addressParts.find(part => /^\d{5}(-\d{4})?$/.test(part)) || '';
    const state = addressParts.find(part => /^[A-Z]{2}$/.test(part)) || '';
    const city = addressParts[addressParts.indexOf(state) - 2] || '';

    // Get building details from OSM
    const buildingType = building.tags.building || nominatimData[0].type || 'unknown';
    const buildingName = building.tags.name || nominatimData[0].name || '';
    
    // Try to get floor count and estimate rooms
    const floors = parseInt(building.tags['building:levels'] || '0');
    const estimatedBedrooms = Math.max(1, Math.floor((floors || 1) * 2));
    const estimatedBathrooms = Math.max(1, Math.floor((floors || 1) * 1.5));
    
    // Calculate approximate square footage based on building footprint
    let squareFootage = 0;
    if ('way' in building && building.nodes) {
      // Rough calculation based on building nodes (footprint)
      const nodeCount = building.nodes.length;
      if (nodeCount > 2) {
        squareFootage = nodeCount * 500; // Rough estimate
      }
    }

    // Convert OSM data to our Property type
    return {
      address: {
        line1: buildingName ? `${buildingName}, ${address}` : address,
        city,
        state,
        zipCode,
      },
      propertyType: buildingType,
      yearBuilt: building.tags['start_date'] || building.tags['construction_date'] || null,
      bedrooms: parseInt(building.tags['building:flats'] || String(estimatedBedrooms)) || estimatedBedrooms,
      bathrooms: parseInt(building.tags['building:bathrooms'] || String(estimatedBathrooms)) || estimatedBathrooms,
      squareFootage: parseInt(building.tags['building:floor_area'] || String(squareFootage)) || squareFootage,
      lotSize: null,
      price: null,
      description: `${buildingType.charAt(0).toUpperCase() + buildingType.slice(1)} property${buildingName ? ` (${buildingName})` : ''} located at ${address}`,
      features: [
        buildingType,
        building.tags['building:material'],
        building.tags['building:use'],
        `${floors} ${floors === 1 ? 'floor' : 'floors'}`
      ].filter(Boolean),
      images: [],
      location: {
        latitude: 'lat' in building ? building.lat : parseFloat(lat),
        longitude: 'lon' in building ? building.lon : parseFloat(lon)
      }
    };
  } catch (error) {
    console.error('Error fetching property data from OpenStreetMap:', error);
    return null;
  }
}

export async function getPropertyHistory(address: string): Promise<PropertyHistory[]> {
  // OpenStreetMap doesn't provide historical data
  return [];
}

export async function searchProperties(query: string): Promise<Property[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=10`,
      {
        headers: {
          'User-Agent': 'FuturisticRealEstate/1.0'
        }
      }
    );

    const results = await response.json();
    
    // Convert Nominatim results to Property objects
    const properties = await Promise.all(
      results
        .filter((result: any) => result.type === 'house' || result.type === 'building')
        .map(async (result: any) => {
          const address = result.display_name;
          return await getPropertyData(address);
        })
    );

    return properties.filter((p): p is Property => p !== null);
  } catch (error) {
    console.error('Error searching properties:', error);
    return [];
  }
}
