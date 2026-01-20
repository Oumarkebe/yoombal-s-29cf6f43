export const mockZones = [
    {
        id: 'z1',
        name: 'Plateau',
        color: '#3b82f6',
        coordinates: [
            [14.6706, -17.4300],
            [14.6550, -17.4350],
            [14.6600, -17.4500],
            [14.6800, -17.4400]
        ] as [number, number][]
    },
    {
        id: 'z2',
        name: 'Mermoz/Sacré-Cœur',
        color: '#10b981',
        coordinates: [
            [14.7100, -17.4700],
            [14.7000, -17.4800],
            [14.7200, -17.4900],
            [14.7300, -17.4800]
        ] as [number, number][]
    }
];

export const mockDeliveries = [
    { id: 'd1', driverName: 'Moussa Diop', lat: 14.6750, lng: -17.4350, status: 'delivering' as const },
    { id: 'd2', driverName: 'Fatou Sow', lat: 14.7150, lng: -17.4850, status: 'picking_up' as const },
];
