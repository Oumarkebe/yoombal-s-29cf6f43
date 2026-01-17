
// Logic for Merchant Simulation
export interface ProductGenResult {
    title: string;
    description: string;
    price: string;
    optimizedPrice: string;
    seoTags: string[];
    competition: string;
}

export function generateProductMetadata(productName: string): Promise<ProductGenResult> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                title: `✨ ${productName} Premium - Édition Limitée`,
                description: `Découvrez l'élégance ultime avec ce ${productName}. Conçu pour allier style et confort, c'est l'accessoire indispensable de la saison.`,
                price: "25 000 F",
                optimizedPrice: "24 900 F (Recommandé par IA)",
                seoTags: ["#Mode", "#Tendance2026", "#DakarHighLife"],
                competition: "Faible concurrence locale"
            });
        }, 1500); // Simulated delay
    });
}
