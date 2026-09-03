import type { CardId } from "./card";
import { getCardDefinition } from "./card";

export const STARTING_LIFE_UNITS = 20;
export const MIN_LIFE_BET = 1;
export const MATCH_ROUNDS = 3;
export const OPENING_HAND_SIZE = 3;
export const COPIES_PER_CARD = 3;

export const MATCHUP_WIN_BONUS = 3;
export const MATCHUP_LOSS_PENALTY = -1;
export const MATCHUP_NEUTRAL = 0;

const BEATS: Readonly<Record<CardId, CardId>> = {
  crane: "deer",
  deer: "butterfly",
  butterfly: "swallow",
  swallow: "boar",
  boar: "crane",
};

export type MatchupModifier =
  | typeof MATCHUP_WIN_BONUS
  | typeof MATCHUP_LOSS_PENALTY
  | typeof MATCHUP_NEUTRAL;

export function getMatchupModifier(
  card: CardId,
  opponent: CardId,
): MatchupModifier {
  if (BEATS[card] === opponent) {
    return MATCHUP_WIN_BONUS;
  }

  if (BEATS[opponent] === card) {
    return MATCHUP_LOSS_PENALTY;
  }

  return MATCHUP_NEUTRAL;
}

export function calculateScore(
  card: CardId,
  lifeBet: number,
  opponent: CardId,
): number {
  if (!Number.isInteger(lifeBet) || lifeBet < MIN_LIFE_BET) {
    throw new Error("Life bet must be a positive integer.");
  }

  return (
    getCardDefinition(card).baseScore +
    lifeBet +
    getMatchupModifier(card, opponent)
  );
}
