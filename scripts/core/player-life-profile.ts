import { getLifeState, type LifeState, unitsToLife } from "./life";
import { STARTING_LIFE_UNITS } from "./rules";

export interface ResolvedLifeProfile {
  readonly lifeUnits: number;
  readonly initialized: boolean;
  readonly state: LifeState;
}

export function assertValidLifeUnits(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("Life units must be a non-negative integer.");
  }

  return value;
}

export function resolveStoredLifeUnits(
  storedValue: unknown,
): ResolvedLifeProfile {
  if (storedValue === undefined) {
    return {
      lifeUnits: STARTING_LIFE_UNITS,
      initialized: true,
      state: getLifeState(STARTING_LIFE_UNITS),
    };
  }

  if (typeof storedValue !== "number") {
    throw new Error("Stored life units must be a number.");
  }

  const lifeUnits = assertValidLifeUnits(storedValue);

  return {
    lifeUnits,
    initialized: false,
    state: getLifeState(lifeUnits),
  };
}

export function formatLifeUnits(lifeUnits: number): string {
  const life = unitsToLife(assertValidLifeUnits(lifeUnits));
  return Number.isInteger(life) ? String(life) : life.toFixed(1);
}
