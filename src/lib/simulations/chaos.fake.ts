import { createSimulationEngine } from './engine';
import { SimulationEvent } from './types';

type EngineType = ReturnType<typeof createSimulationEngine>;

export interface ChaosEffect {
  target: 'orders' | 'stock' | 'delivery' | 'bnpl';
  magnitude: number; // multiplier (e.g., 2.0 = double, 0.5 = half)
  duration: number; // steps
}

export interface ChaosResult {
  event: SimulationEvent;
  effect: ChaosEffect | null;
}

export function triggerChaos(engine: EngineType): ChaosResult {
  const scenarios = [
    {
      title: 'Pic de trafic (Tabaski Rush)',
      action: 'Auto-scaling des serveurs (+50%)',
      target: 'orders',
      magnitude: 2.5, // Huge spike in orders
    },
    {
      title: 'Embouteillages Monstres (Centre-ville)',
      action: 'Reroutage intelligent des livreurs',
      target: 'delivery',
      magnitude: 0.6, // Drop in efficiency
    },
    {
      title: 'Rupture Stock (Riz/Sucre)',
      action: 'Alerte Fournisseur Prioritaire',
      target: 'stock',
      magnitude: 0.0, // Stock drops to zero
    },
    {
      title: 'Hausse Demande BNPL (Fin de mois)',
      action: 'Allocation fonds supplémentaires',
      target: 'bnpl',
      magnitude: 1.8, // Spike in credit requests
    },
  ] as const;

  const picked = scenarios[Math.floor(Math.random() * scenarios.length)];

  // Log the "Detected" event immediately
  engine.log(`⚡ CHAOS DÉTECTÉ : ${picked.title}`, 'critical');

  // We return the effect so the UI can react visually
  return {
    event: {
      time: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      message: `✔ ACTION IA : ${picked.action}`,
      level: 'info',
    },
    effect: {
      target: picked.target,
      magnitude: picked.magnitude,
      duration: 5,
    },
  };
}
