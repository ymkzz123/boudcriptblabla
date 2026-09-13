import { strict as assert } from "node:assert";

import type { CardId } from "../scripts/core/card";
import type { CardSelectionResult } from "../scripts/core/card-selection";
import { applyCardSelection } from "../scripts/core/match-card-selection";
import type { MatchPhase, MatchPlayerState, MatchState } from "../scripts/core/match-state";

function createPlayer(playerId: string, hand: readonly CardId[]): MatchPlayerState {
  return {
    playerId,
    lifeUnits: 20,
    deck: [],
    hand,
    usedCards: [],
    cardSelection: null,
    lifeBet: null,
  };
}

function createMatch(phase: MatchPhase = "cardSelection"): MatchState {
  return {
    matchId: "match-1",
    phase,
    round: 1,
    players: [
      createPlayer("player-a", ["swallow", "deer", "swallow"]),
      createPlayer("player-b", ["crane", "boar", "butterfly"]),
    ],
  };
}

const duplicateSelection: CardSelectionResult = {
  selectedCard: "swallow",
  handIndex: 2,
};

const initialState = createMatch();
const playerBInitialState = initialState.players[1];
const afterPlayerA = applyCardSelection(initialState, "player-a", duplicateSelection);

assert.deepEqual(afterPlayerA.players[0].cardSelection, duplicateSelection);
assert.equal(afterPlayerA.players[0].cardSelection?.handIndex, 2);
assert.equal(afterPlayerA.players[0].cardSelection?.selectedCard, "swallow");
assert.equal(afterPlayerA.players[1].cardSelection, null);
assert.strictEqual(afterPlayerA.players[1], playerBInitialState);
assert.equal(afterPlayerA.phase, "cardSelection");
assert.equal(initialState.players[0].cardSelection, null);
assert.equal(initialState.phase, "cardSelection");

const playerBSelection: CardSelectionResult = {
  selectedCard: "boar",
  handIndex: 1,
};
const afterBothPlayers = applyCardSelection(afterPlayerA, "player-b", playerBSelection);

assert.deepEqual(afterBothPlayers.players[1].cardSelection, playerBSelection);
assert.deepEqual(afterBothPlayers.players[0].cardSelection, duplicateSelection);
assert.equal(afterBothPlayers.phase, "lifeBetting");
assert.equal(afterBothPlayers.players[0].lifeBet, null);
assert.equal(afterBothPlayers.players[1].lifeBet, null);

assert.throws(() => applyCardSelection(createMatch("roundStart"), "player-a", duplicateSelection));
assert.throws(() => applyCardSelection(createMatch(), "unknown-player", duplicateSelection));
assert.throws(() =>
  applyCardSelection(createMatch(), "player-a", {
    selectedCard: "swallow",
    handIndex: 3,
  }),
);
assert.throws(() =>
  applyCardSelection(createMatch(), "player-a", {
    selectedCard: "deer",
    handIndex: 0,
  }),
);
assert.throws(() => applyCardSelection(afterPlayerA, "player-a", duplicateSelection));

const stateBeforeInvalidSelection = createMatch();
const playerABeforeInvalidSelection = stateBeforeInvalidSelection.players[0];
const playerBBeforeInvalidSelection = stateBeforeInvalidSelection.players[1];

assert.throws(() =>
  applyCardSelection(stateBeforeInvalidSelection, "player-a", {
    selectedCard: "butterfly",
    handIndex: -1,
  }),
);
assert.equal(stateBeforeInvalidSelection.phase, "cardSelection");
assert.strictEqual(stateBeforeInvalidSelection.players[0], playerABeforeInvalidSelection);
assert.strictEqual(stateBeforeInvalidSelection.players[1], playerBBeforeInvalidSelection);
assert.equal(stateBeforeInvalidSelection.players[0].cardSelection, null);
assert.equal(stateBeforeInvalidSelection.players[1].cardSelection, null);

console.log("match-card-selection: ok");
