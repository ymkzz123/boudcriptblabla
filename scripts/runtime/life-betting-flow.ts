import type { LifeBettingLimits } from "../core/match-life-betting";
import type { MatchController } from "./match-controller";

export type LifeBettingRequest = (
  limits: LifeBettingLimits,
) => Promise<number | undefined>;

export type LifeBettingFlowResult = "canceled" | "submitted";

export async function runLifeBettingFlow(
  controller: MatchController,
  playerId: string,
  requestLifeBet: LifeBettingRequest,
): Promise<LifeBettingFlowResult> {
  const limitsSnapshot = { ...controller.getLifeBettingLimits(playerId) };
  const lifeBet = await requestLifeBet(limitsSnapshot);

  if (lifeBet === undefined) {
    return "canceled";
  }

  await controller.submitLifeBet(playerId, lifeBet);
  return "submitted";
}
