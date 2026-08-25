import type { CardId } from "./card";

export type MatchPhase =
  | "lobby"
  | "dealing"
  | "selecting"
  | "resolving"
  | "roundEnd"
  | "finished";

export interface PlayerState {
  readonly playerId: string;
  readonly hand: readonly CardId[];
  readonly energy: number;
}

export interface MatchState {
  readonly matchId: string;
  readonly phase: MatchPhase;
  readonly round: number;
  readonly players: readonly PlayerState[];
}
