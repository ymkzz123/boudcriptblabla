import { CARD_IDS, type CardId } from "./card";
import { COPIES_PER_CARD, OPENING_HAND_SIZE } from "./rules";

export interface DealResult {
  readonly hand: readonly CardId[];
  readonly deck: readonly CardId[];
}

export function createPersonalDeck(): CardId[] {
  const deck: CardId[] = [];

  for (const cardId of CARD_IDS) {
    for (let copy = 0; copy < COPIES_PER_CARD; copy += 1) {
      deck.push(cardId);
    }
  }

  return deck;
}

export function shuffleDeck(
  deck: readonly CardId[],
  random: () => number = Math.random,
): CardId[] {
  const shuffled = [...deck];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }

  return shuffled;
}

export function dealOpeningHand(
  deck: readonly CardId[],
  handSize: number = OPENING_HAND_SIZE,
): DealResult {
  if (!Number.isInteger(handSize) || handSize < 0) {
    throw new Error("Hand size must be a non-negative integer.");
  }

  if (deck.length < handSize) {
    throw new Error("Not enough cards in deck to deal opening hand.");
  }

  return {
    hand: deck.slice(0, handSize),
    deck: deck.slice(handSize),
  };
}
