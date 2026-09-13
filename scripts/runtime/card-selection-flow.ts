import type { CardId } from "../core/card";
import type { CardSelectionResult } from "../core/card-selection";
import type { MatchController } from "./match-controller";

export type CardSelectionRequest = (
  hand: readonly CardId[],
) => Promise<CardSelectionResult | undefined>;

export type CardSelectionFlowResult = "canceled" | "submitted";

export async function runCardSelectionFlow(
  controller: MatchController,
  playerId: string,
  requestSelection: CardSelectionRequest,
): Promise<CardSelectionFlowResult> {
  const handSnapshot = [...controller.getCardSelectionHand(playerId)];
  const selection = await requestSelection(handSnapshot);

  if (selection === undefined) {
    return "canceled";
  }

  await controller.submitCardSelection(playerId, selection);
  return "submitted";
}
