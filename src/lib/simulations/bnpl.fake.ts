
export interface BNPLResult {
    amount: number;
    installments: number;
    score: number;
    decision: "ACCEPTÉ" | "REFUSÉ";
    confidence: number;
}

export function simulateBNPL(amount: number): BNPLResult {
    // Random score between 60 and 100
    const score = Math.round(60 + Math.random() * 40);
    // Accept if score > 70
    const accepted = score > 70;

    return {
        amount,
        installments: 4,
        score,
        decision: accepted ? "ACCEPTÉ" : "REFUSÉ",
        confidence: Math.round(75 + Math.random() * 20),
    };
}
