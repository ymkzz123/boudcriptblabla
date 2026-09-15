import { getMaxLifeBet, unitsToLife } from "./life";
import type { MatchPlayerState, MatchState } from "./match-state";
import { MIN_LIFE_BET } from "./rules";

export interface LifeBettingLimits {
  readonly currentLife: number;
  readonly minLifeBet: number;
  readonly maxLifeBet: number;
}

function findPlayerIndex(state: MatchState, playerId: string): 0 | 1 {
  if (state.players[0].playerId === playerId) {
    return 0;
  }

  if (state.players[1].playerId === playerId) {
    return 1;
  }

  throw new Error("Player does not belong to this match.");
}

function getPlayerAwaitingLifeBet(
  state: MatchState,
  playerId: string,
): {
  readonly playerIndex: 0 | 1;
  readonly player: MatchPlayerState;
  readonly maxLifeBet: number;
} {
  if (state.phase !== "lifeBetting") {
    throw new Error("Life betting is not allowed in the current match phase.");
  }

  const playerIndex = findPlayerIndex(state, playerId);
  const player = state.players[playerIndex];

  if (player.cardSelection === null) {
    throw new Error("Player must commit a card selection before betting life.");
  }

  if (player.lifeBet !== null) {
    throw new Error("Player has already committed a life bet.");
  }

  const maxLifeBet = getMaxLifeBet(player.lifeUnits);

  if (maxLifeBet < MIN_LIFE_BET) {
    throw new Error("Player does not have enough life to place a legal bet.");
  }

  return { playerIndex, player, maxLifeBet };
}

function validateLifeBet(lifeBet: number, maxLifeBet: number): void {
  if (!Number.isInteger(lifeBet)) {
    throw new Error("Life bet must be an integer.");
  }

  if (lifeBet < MIN_LIFE_BET) {
    throw new Error(`Life bet must be at least ${MIN_LIFE_BET}.`);
  }

  if (lifeBet > maxLifeBet) {
    throw new Error(`Life bet must not exceed ${maxLifeBet}.`);
  }
}

export function getLifeBettingLimits(
  state: MatchState,
  playerId: string,
): LifeBettingLimits {
  const { player, maxLifeBet } = getPlayerAwaitingLifeBet(state, playerId);

  return {
    currentLife: unitsToLife(player.lifeUnits),
    minLifeBet: MIN_LIFE_BET,
    maxLifeBet,
  };
}

export function applyLifeBet(
  state: MatchState,
  playerId: string,
  lifeBet: number,
): MatchState {
  const { playerIndex, player, maxLifeBet } = getPlayerAwaitingLifeBet(
    state,
    playerId,
  );
  validateLifeBet(lifeBet, maxLifeBet);

  const updatedPlayer: MatchPlayerState = {
    ...player,
    lifeBet,
  };
  const players: readonly [MatchPlayerState, MatchPlayerState] =
    playerIndex === 0
      ? [updatedPlayer, state.players[1]]
      : [state.players[0], updatedPlayer];
  const allSelectionsLocked = players.every(
    (matchPlayer) =>
      matchPlayer.cardSelection !== null && matchPlayer.lifeBet !== null,
  );

  return {
    ...state,
    phase: allSelectionsLocked ? "selectionLocked" : "lifeBetting",
    players,
  };
}
