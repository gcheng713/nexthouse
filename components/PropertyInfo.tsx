import { useEffect, useState } from 'react';
import { PropertyData, getPropertyData, getPropertyHistory } from '@/lib/realtymole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PropertyInfoProps {
  address: string;
}

export function PropertyInfo({ address }: PropertyInfoProps) {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!address) return;
      
      setLoading(true);
      setError(null);
      setPropertyData(null);
      setPriceHistory([]);
      
      try {
        console.log('Fetching data for address:', address);
        const [details, history] = await Promise.all([
          getPropertyData(address),
          getPropertyHistory(address)
        ]);
        
        console.log('Property details:', details);
        console.log('Price history:', history);
        
        if (details) {
          setPropertyData(details);
          setPriceHistory(history);
        } else {
          setError('No property data found for this address');
        }
      } catch (err) {
        setError('Failed to fetch property data');
        console.error('Error fetching property data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [address]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!propertyData) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-lg font-semibold">{formatPrice(propertyData.details.price)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Square Footage</p>
              <p className="text-lg font-semibold">{propertyData.details.squareFootage} sq ft</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bedrooms</p>
              <p className="text-lg font-semibold">{propertyData.details.bedrooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bathrooms</p>
              <p className="text-lg font-semibold">{propertyData.details.bathrooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Days on Market</p>
              <p className="text-lg font-semibold">{propertyData.details.daysOnMarket}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold">{propertyData.details.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {priceHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis
                    tickFormatter={(price) => formatPrice(price)}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatPrice(value), 'Price']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
