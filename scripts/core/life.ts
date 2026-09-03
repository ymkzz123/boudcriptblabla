import type { CardId } from "./card";

export type LifeState = "active" | "halfLifeRecovery" | "zeroLifeRecovery";
export type RoundOutcome = "win" | "loss" | "draw";

export function lifeToUnits(life: number): number {
  const units = life * 2;

  if (!Number.isInteger(units) || units < 0) {
    throw new Error("Life must be a non-negative multiple of 0.5.");
  }

  return units;
}

export function unitsToLife(lifeUnits: number): number {
  if (!Number.isInteger(lifeUnits) || lifeUnits < 0) {
    throw new Error("Life units must be a non-negative integer.");
  }

  return lifeUnits / 2;
}

export function getMaxLifeBet(lifeUnits: number): number {
  return Math.floor(unitsToLife(lifeUnits));
}

export function getLifeState(lifeUnits: number): LifeState {
  if (lifeUnits <= 0) {
    return "zeroLifeRecovery";
  }

  if (lifeUnits === 1) {
    return "halfLifeRecovery";
  }

  return "active";
}

export function getLifeDeltaUnits(
  outcome: RoundOutcome,
  lifeBet: number,
  card: CardId,
  effectEnabled: boolean,
): number {
  if (!Number.isInteger(lifeBet) || lifeBet < 1) {
    throw new Error("Life bet must be a positive integer.");
  }

  if (outcome === "draw") {
    return 0;
  }

  const normalDelta = lifeBet * 2;

  if (card !== "crane" || !effectEnabled) {
    return outcome === "win" ? normalDelta : -normalDelta;
  }

  if (outcome === "win") {
    return normalDelta * 2;
  }

  return -lifeBet;
}

export function applyLifeDelta(
  currentLifeUnits: number,
  deltaUnits: number,
): number {
  if (!Number.isInteger(currentLifeUnits) || currentLifeUnits < 0) {
    throw new Error("Current life units must be a non-negative integer.");
  }

  if (!Number.isInteger(deltaUnits)) {
    throw new Error("Life delta units must be an integer.");
  }

  return Math.max(0, currentLifeUnits + deltaUnits);
}
