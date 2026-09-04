import { CARD_IDS, getCardDefinition, type CardId } from "./card";

export function getCardItemTypeId(cardId: CardId): string {
  return getCardDefinition(cardId).itemTypeId;
}

export function getCardIdFromItemTypeId(
  itemTypeId: string,
): CardId | undefined {
  for (const cardId of CARD_IDS) {
    if (getCardItemTypeId(cardId) === itemTypeId) {
      return cardId;
    }
  }

  return undefined;
}

export function isCryptboundCardItem(itemTypeId: string): boolean {
  return getCardIdFromItemTypeId(itemTypeId) !== undefined;
}
