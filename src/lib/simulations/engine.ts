
import { SimulationContext, SimulationEvent } from "./types";

export function createSimulationEngine(ctx: SimulationContext) {
    const events: SimulationEvent[] = [];

    function log(message: string, level: SimulationEvent["level"] = "info") {
        // Keep only last 50 events to avoid memory leak in long runs
        if (events.length > 50) events.shift();

        events.push({
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            message,
            level,
        });
    }

    function randomFactor(base: number) {
        // Returns a value between base * 0.8 and base * 1.2
        return Math.round(base * (0.8 + Math.random() * 0.4));
    }

    function shouldChaos() {
        return Math.random() < ctx.chaosLevel;
    }

    return {
        log,
        events,
        randomFactor,
        shouldChaos,
    };
}
