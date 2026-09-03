import type { CardId } from "./card";

export type MatchPhase =
  | "idle"
  | "playerRegistration"
  | "readyCheck"
  | "matchSetup"
  | "roundStart"
  | "cardSelection"
  | "lifeBetting"
  | "selectionLocked"
  | "preRevealEffects"
  | "cardReveal"
  | "scoreCalculation"
  | "roundResult"
  | "lifeSettlement"
  | "lifeStateCheck"
  | "postRoundEffects"
  | "roundBreak"
  | "matchEnd"
  | "rematchVote"
  | "zeroLifeRecovery"
  | "halfLifeRecovery"
  | "sessionEnd"
  | "forcedAbort";

export interface MatchPlayerState {
  readonly playerId: string;
  readonly lifeUnits: number;
  readonly deck: readonly CardId[];
  readonly hand: readonly CardId[];
  readonly usedCards: readonly CardId[];
  readonly selectedCard: CardId | null;
  readonly lifeBet: number | null;
  readonly selectionLocked: boolean;
}

export interface MatchState {
  readonly matchId: string;
  readonly phase: MatchPhase;
  readonly round: number;
  readonly players: readonly [MatchPlayerState, MatchPlayerState];
}
