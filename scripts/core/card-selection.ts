import type { CardId } from "./card";

export interface CardSelectionResult {
  readonly selectedCard: CardId;
  readonly handIndex: number;
}

export function selectCardFromHand(
  hand: readonly CardId[],
  handIndex: number,
): CardSelectionResult {
  if (!Number.isInteger(handIndex) || handIndex < 0 || handIndex >= hand.length) {
    throw new Error("Selected hand index is out of range.");
  }

  return {
    selectedCard: hand[handIndex],
    handIndex,
  };
}
