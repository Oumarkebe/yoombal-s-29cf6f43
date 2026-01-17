
export type SimulationSpeed = 1 | 2 | 5;

export interface SimulationContext {
    speed: SimulationSpeed;
    chaosLevel: number; // 0 → 1
    objective: "growth" | "profit" | "stability";
}

export interface SimulationEvent {
    time: string;
    message: string;
    level: "info" | "warning" | "critical";
}
