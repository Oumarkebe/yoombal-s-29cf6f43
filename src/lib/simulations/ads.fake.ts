
// Logic for Ads Simulation

export interface AdsDayData {
    name: string;
    Organique: number;
    Payant: number;
    Ventes: number;
}

export function generateAdsData(budget: number): AdsDayData[] {
    return Array.from({ length: 7 }, (_, i) => {
        const day = i + 1;
        const baseReach = budget * 0.4;
        const organic = 500 + (day * 50) + (Math.random() * 100);
        const paid = baseReach + (Math.random() * baseReach * 0.2);
        return {
            name: `J${day}`,
            Organique: Math.round(organic),
            Payant: Math.round(paid),
            Ventes: Math.round((organic + paid) * 0.02)
        };
    });
}
