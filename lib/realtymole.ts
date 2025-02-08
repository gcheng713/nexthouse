import { getPropertyData as getOSMPropertyData } from './openstreetmap';

interface PropertyDetails {
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyType: string;
  lastSeen: string;
  daysOnMarket: number;
  status: string;
}

interface PriceHistory {
  date: string;
  price: number;
  event: string;
}

export interface PropertyData {
  details: PropertyDetails;
  priceHistory: PriceHistory[];
}

export async function getPropertyData(address: string): Promise<PropertyData | null> {
  try {
    const osmProperty = await getOSMPropertyData(address);
    
    if (!osmProperty) {
      return null;
    }

    return {
      details: {
        price: 0, // OSM doesn't provide price data
        bedrooms: osmProperty.bedrooms || 0,
        bathrooms: osmProperty.bathrooms || 0,
        squareFootage: osmProperty.squareFootage || 0,
        propertyType: osmProperty.propertyType || 'Unknown',
        lastSeen: new Date().toISOString(),
        daysOnMarket: 0,
        status: 'Information Only'
      },
      priceHistory: []
    };
  } catch (error) {
    console.error('Error fetching property data:', error);
    return null;
  }
}

export async function getPropertyHistory(address: string): Promise<PriceHistory[]> {
  // OpenStreetMap doesn't provide historical data
  return [];
}
