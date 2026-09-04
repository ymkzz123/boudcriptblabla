import type { CardId } from "./card";

export interface CardSelectionResult {
  readonly selectedCard: CardId;
  readonly handIndex: number;
}

export function findCardInHand(
  hand: readonly CardId[],
  cardId: CardId,
): number {
  return hand.indexOf(cardId);
}

export function selectCardFromHand(
  hand: readonly CardId[],
  cardId: CardId,
): CardSelectionResult {
  const handIndex = findCardInHand(hand, cardId);

  if (handIndex < 0) {
    throw new Error("Selected card is not in the player's hand.");
  }

  return {
    selectedCard: cardId,
    handIndex,
  };
}
