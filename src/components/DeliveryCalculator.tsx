import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Calculator, Truck } from 'lucide-react';
import { useDeliveryZones } from '@/hooks/useDeliveryZones';

interface DeliveryCalculatorProps {
  onCalculate?: (fee: number, zone: string) => void;
  className?: string;
}

const DeliveryCalculator: React.FC<DeliveryCalculatorProps> = ({ onCalculate, className }) => {
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [estimatedFee, setEstimatedFee] = useState<number>(0);
  const { zones, calculateDeliveryFee, getZoneByArea } = useDeliveryZones();

  const handleCalculate = () => {
    if (selectedZone && distance) {
      const fee = calculateDeliveryFee(selectedZone, parseFloat(distance));
      setEstimatedFee(fee);
      onCalculate?.(fee, selectedZone);
    }
  };

  const handleAddressChange = (address: string) => {
    // Try to auto-detect zone from address
    const detectedZone = getZoneByArea(address);
    if (detectedZone) {
      setSelectedZone(detectedZone.id);
    }
  };

  useEffect(() => {
    if (selectedZone && distance) {
      handleCalculate();
    }
  }, [selectedZone, distance]);

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold">Calculateur de livraison</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="delivery-address">Adresse de livraison</Label>
          <Input
            id="delivery-address"
            placeholder="Ex: Plateau, Dakar"
            onChange={(e) => handleAddressChange(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="delivery-zone">Zone de livraison</Label>
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une zone" />
            </SelectTrigger>
            <SelectContent>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{zone.name}</span>
                    <span className="text-sm text-gray-500">({zone.areas.join(', ')})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="distance">Distance estimée (km)</Label>
          <Input
            id="distance"
            type="number"
            placeholder="Ex: 5.5"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            min="0"
            step="0.1"
          />
        </div>

        {selectedZone && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Détails de la zone</h4>
            {zones.find((z) => z.id === selectedZone) && (
              <div className="space-y-1 text-sm">
                <p>
                  Frais de base:{' '}
                  {zones.find((z) => z.id === selectedZone)?.base_fee.toLocaleString()} CFA
                </p>
                <p>
                  Prix par km:{' '}
                  {zones.find((z) => z.id === selectedZone)?.price_per_km.toLocaleString()} CFA
                </p>
                <p>
                  Temps max: {zones.find((z) => z.id === selectedZone)?.max_delivery_time_minutes}{' '}
                  minutes
                </p>
              </div>
            )}
          </div>
        )}

        {estimatedFee > 0 && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Frais de livraison estimés</h4>
            </div>
            <p className="text-2xl font-bold text-green-800">{estimatedFee.toLocaleString()} CFA</p>
            {distance && (
              <p className="text-sm text-green-600 mt-1">Pour une distance de {distance} km</p>
            )}
          </div>
        )}

        <Button
          onClick={handleCalculate}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!selectedZone || !distance}
        >
          <Calculator className="mr-2 h-4 w-4" />
          Calculer les frais
        </Button>
      </div>
    </Card>
  );
};

export default DeliveryCalculator;
