import type { Player } from "@minecraft/server";

import {
  runLifeBettingFlow,
  type LifeBettingFlowResult,
} from "../../runtime/life-betting-flow";
import type { MatchController } from "../../runtime/match-controller";
import { showLifeBettingForm } from "./life-betting-ui";

export function runBedrockLifeBetting(
  controller: MatchController,
  player: Player,
): Promise<LifeBettingFlowResult> {
  return runLifeBettingFlow(controller, player.id, (limits) =>
    showLifeBettingForm(player, limits),
  );
}
