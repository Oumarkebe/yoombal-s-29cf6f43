import { useEffect, useRef } from 'react';

export function useAutoSimulation(
  enabled: boolean,
  speed: number, // 1, 2, or 5
  setters: (() => void)[]
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Base interval is 1500ms, divided by speed
    const tickRate = 1500 / speed;

    intervalRef.current = setInterval(() => {
      // Pick a random setter to update, or update all?
      // "Tous les sliders bougent" suggests we might want to update multiple things
      // but maybe not EVERYTHING every tick to avoid chaos.
      // Let's update all of them for the "Alive" effect.
      setters.forEach((fn) => fn());
    }, tickRate);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, speed, setters]);
}
