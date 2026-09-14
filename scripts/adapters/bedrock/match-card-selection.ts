import type { Player } from "@minecraft/server";

import {
  runCardSelectionFlow,
  type CardSelectionFlowResult,
} from "../../runtime/card-selection-flow";
import type { MatchController } from "../../runtime/match-controller";
import { showCardSelectionForm } from "./card-selection-ui";

export function runBedrockCardSelection(
  controller: MatchController,
  player: Player,
): Promise<CardSelectionFlowResult> {
  return runCardSelectionFlow(controller, player.id, (hand) =>
    showCardSelectionForm(player, hand),
  );
}
