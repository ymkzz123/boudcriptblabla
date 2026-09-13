import { selectCardFromHand, type CardSelectionResult } from "./card-selection";
import type { MatchPlayerState, MatchState } from "./match-state";

function findPlayerIndex(state: MatchState, playerId: string): 0 | 1 {
  if (state.players[0].playerId === playerId) {
    return 0;
  }

  if (state.players[1].playerId === playerId) {
    return 1;
  }

  throw new Error("Player does not belong to this match.");
}

function validateSelection(
  player: MatchPlayerState,
  selection: CardSelectionResult,
): CardSelectionResult {
  const validatedSelection = selectCardFromHand(player.hand, selection.handIndex);

  if (validatedSelection.selectedCard !== selection.selectedCard) {
    throw new Error("Selected card does not match the current hand.");
  }

  return validatedSelection;
}

export function applyCardSelection(
  state: MatchState,
  playerId: string,
  selection: CardSelectionResult,
): MatchState {
  if (state.phase !== "cardSelection") {
    throw new Error("Card selection is not allowed in the current match phase.");
  }

  const playerIndex = findPlayerIndex(state, playerId);
  const player = state.players[playerIndex];

  if (player.cardSelection !== null) {
    throw new Error("Player has already committed a card selection.");
  }

  const validatedSelection = validateSelection(player, selection);
  const updatedPlayer: MatchPlayerState = {
    ...player,
    cardSelection: validatedSelection,
  };
  const players: readonly [MatchPlayerState, MatchPlayerState] =
    playerIndex === 0 ? [updatedPlayer, state.players[1]] : [state.players[0], updatedPlayer];
  const allPlayersSelected = players.every((matchPlayer) => matchPlayer.cardSelection !== null);

  return {
    ...state,
    phase: allPlayersSelected ? "lifeBetting" : "cardSelection",
    players,
  };
}
