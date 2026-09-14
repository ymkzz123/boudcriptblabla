import type { CardId } from "../core/card";
import type { CardSelectionResult } from "../core/card-selection";
import {
  applyCardSelection,
  getCardSelectionHand,
} from "../core/match-card-selection";
import type { MatchState } from "../core/match-state";

type MatchTransition = (state: MatchState) => MatchState;

export class MatchController {
  private currentState: MatchState;
  private updateQueue: Promise<void> = Promise.resolve();

  public constructor(initialState: MatchState) {
    this.currentState = initialState;
  }

  public getState(): MatchState {
    return this.currentState;
  }

  public getCardSelectionHand(playerId: string): readonly CardId[] {
    return getCardSelectionHand(this.currentState, playerId);
  }

  public submitCardSelection(
    playerId: string,
    selection: CardSelectionResult,
  ): Promise<MatchState> {
    return this.enqueueTransition((state) =>
      applyCardSelection(state, playerId, selection),
    );
  }

  private enqueueTransition(transition: MatchTransition): Promise<MatchState> {
    const operation = this.updateQueue.then(() => {
      const nextState = transition(this.currentState);
      this.currentState = nextState;
      return nextState;
    });

    this.updateQueue = operation.then(
      () => undefined,
      () => undefined,
    );

    return operation;
  }
}
