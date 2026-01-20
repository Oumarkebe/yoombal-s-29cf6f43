import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Car, Bike, Truck } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DeliveryZone {
    id: string;
    name: string;
    coordinates: [number, number][]; // Array of [lat, lng]
    color: string;
}

interface DeliveryLocation {
    id: string;
    driverName: string;
    lat: number;
    lng: number;
    status: 'picking_up' | 'delivering' | 'idle';
    vehicleType?: 'car' | 'bike' | 'scooter';
    bearing?: number; // Direction in degrees
    speed?: number; // Speed in km/h
}

interface DeliveryMapProps {
    zones: DeliveryZone[];
    deliveries: DeliveryLocation[];
    className?: string;
}

// Dakar coordinates
const CENTER: [number, number] = [14.7167, -17.4677];

// Create custom icons dynamically
const createVehicleIcon = (type: string, bearing: number = 0, status: string) => {
    const color = status === 'idle' ? '#94a3b8' : status === 'picking_up' ? '#f59e0b' : '#16a34a';

    let IconComponent = Car;
    if (type === 'bike') IconComponent = Bike;
    if (type === 'scooter') IconComponent = Truck; // Placeholder for scooter

    const iconHtml = renderToStaticMarkup(
        <div style={{
            transform: `rotate(${bearing}deg)`,
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '50%',
                padding: '6px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                border: `2px solid ${color}`
            }}>
                <IconComponent size={20} color={color} fill={color} fillOpacity={0.2} />
            </div>
            {/* Direction pointer */}
            <div style={{
                position: 'absolute',
                top: '-5px',
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderBottom: `6px solid ${color}`,
                left: '50%',
                marginLeft: '-4px'
            }} />
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-vehicle-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

export function DeliveryMap({ zones, deliveries, className }: DeliveryMapProps) {

    return (
        <div className={`w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm relative z-0 ${className || 'h-[500px]'}`}>
            <MapContainer
                center={CENTER}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                className="z-0"
            >
                {/* 
                  Yango/Uber style typically uses cleaner, high-contrast maps. 
                  CartoDB Voyager is a great free alternative that looks modern and clean.
                */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* Draw Zones with softer opacity */}
                {zones.map((zone) => (
                    <Polygon
                        key={zone.id}
                        positions={zone.coordinates}
                        pathOptions={{
                            color: zone.color,
                            fillColor: zone.color,
                            fillOpacity: 0.1,
                            weight: 2,
                            dashArray: '5, 5'
                        }}
                    >
                        <Popup className="font-sans font-bold text-sm">{zone.name}</Popup>
                    </Polygon>
                ))}

                {/* Draw active deliveries with custom vehicle icons */}
                {deliveries.map((delivery) => (
                    <Marker
                        key={delivery.id}
                        position={[delivery.lat, delivery.lng]}
                        icon={createVehicleIcon(delivery.vehicleType || 'car', delivery.bearing || 0, delivery.status)}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-base">{delivery.driverName}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${delivery.status === 'delivering' ? 'bg-green-100 text-green-700' :
                                        delivery.status === 'picking_up' ? 'bg-orange-100 text-orange-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                        {delivery.status === 'delivering' ? 'En livraison' : delivery.status === 'picking_up' ? 'Récupération' : 'Disponible'}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 space-y-1">
                                    <p>Véhicule: {delivery.vehicleType === 'bike' ? 'Moto' : 'Voiture'}</p>
                                    <p>Vitesse: {delivery.speed !== undefined ? Math.round(delivery.speed) : 0} km/h</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
