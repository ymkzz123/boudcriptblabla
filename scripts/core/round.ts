import type { CardId } from "./card";
import { calculateScore } from "./rules";

export type RoundResult = "playerA" | "playerB" | "draw";

export interface RoundScores {
  readonly playerA: number;
  readonly playerB: number;
  readonly result: RoundResult;
}

export function determineRoundResult(
  playerAScore: number,
  playerBScore: number,
): RoundResult {
  if (playerAScore > playerBScore) {
    return "playerA";
  }

  if (playerBScore > playerAScore) {
    return "playerB";
  }

  return "draw";
}

export function calculateRoundScores(
  playerACard: CardId,
  playerABet: number,
  playerBCard: CardId,
  playerBBet: number,
): RoundScores {
  const playerA = calculateScore(playerACard, playerABet, playerBCard);
  const playerB = calculateScore(playerBCard, playerBBet, playerACard);

  return {
    playerA,
    playerB,
    result: determineRoundResult(playerA, playerB),
  };
}
