import type { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import { getCardDefinition, type CardId } from "../../core/card";
import { selectCardFromHand, type CardSelectionResult } from "../../core/card-selection";

function getCardButtonText(cardId: CardId): string {
  const card = getCardDefinition(cardId);

  return `${card.displayName}\n§7${card.grade}등급 · 기본 ${card.baseScore}점`;
}

export async function showCardSelectionForm(
  player: Player,
  hand: readonly CardId[],
): Promise<CardSelectionResult | undefined> {
  if (hand.length === 0) {
    throw new Error("Cannot show card selection for an empty hand.");
  }

  const form = new ActionFormData()
    .title("§l카드 선택")
    .body("이번 라운드에 사용할 카드를 고르세요.\n선택한 카드는 상대에게 공개되지 않습니다.");

  for (const cardId of hand) {
    form.button(getCardButtonText(cardId));
  }

  const response = await form.show(player);

  if (response.canceled || response.selection === undefined) {
    return undefined;
  }

  return selectCardFromHand(hand, response.selection);
}
