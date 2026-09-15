import { strict as assert } from "node:assert";

import type { CardId } from "../scripts/core/card";
import type { CardSelectionResult } from "../scripts/core/card-selection";
import { getMaxLifeBet } from "../scripts/core/life";
import {
  applyLifeBet,
  getLifeBettingLimits,
} from "../scripts/core/match-life-betting";
import type {
  MatchPhase,
  MatchPlayerState,
  MatchState,
} from "../scripts/core/match-state";
import { MIN_LIFE_BET } from "../scripts/core/rules";

const playerASelection: CardSelectionResult = {
  selectedCard: "swallow",
  handIndex: 2,
};
const playerBSelection: CardSelectionResult = {
  selectedCard: "boar",
  handIndex: 1,
};

function createPlayer(
  playerId: string,
  hand: readonly CardId[],
  cardSelection: CardSelectionResult | null,
  lifeUnits = 20,
): MatchPlayerState {
  return {
    playerId,
    lifeUnits,
    deck: [],
    hand,
    usedCards: [],
    cardSelection,
    lifeBet: null,
  };
}

function createMatch(
  phase: MatchPhase = "lifeBetting",
  playerALifeUnits = 20,
): MatchState {
  return {
    matchId: "match-life-betting-1",
    phase,
    round: 1,
    players: [
      createPlayer(
        "player-a",
        ["swallow", "deer", "swallow"],
        playerASelection,
        playerALifeUnits,
      ),
      createPlayer(
        "player-b",
        ["crane", "boar", "butterfly"],
        playerBSelection,
      ),
    ],
  };
}

const minimumBetState = createMatch();
const playerBBeforeMinimumBet = minimumBetState.players[1];
const afterMinimumBet = applyLifeBet(
  minimumBetState,
  "player-a",
  MIN_LIFE_BET,
);

assert.equal(afterMinimumBet.players[0].lifeBet, MIN_LIFE_BET);
assert.equal(afterMinimumBet.players[1].lifeBet, null);
assert.strictEqual(afterMinimumBet.players[1], playerBBeforeMinimumBet);
assert.equal(afterMinimumBet.phase, "lifeBetting");
assert.deepEqual(afterMinimumBet.players[0].cardSelection, playerASelection);
assert.equal(minimumBetState.players[0].lifeBet, null);

const limitedLifeState = createMatch("lifeBetting", 7);
const limitedLifeMaxBet = getMaxLifeBet(7);
const limits = getLifeBettingLimits(limitedLifeState, "player-a");
assert.deepEqual(limits, {
  currentLife: 3.5,
  minLifeBet: MIN_LIFE_BET,
  maxLifeBet: limitedLifeMaxBet,
});
assert.equal(
  applyLifeBet(limitedLifeState, "player-a", limitedLifeMaxBet).players[0]
    .lifeBet,
  limitedLifeMaxBet,
);

assert.throws(() => applyLifeBet(createMatch(), "player-a", 0));
assert.throws(() => applyLifeBet(createMatch(), "player-a", -1));
assert.throws(() => applyLifeBet(createMatch(), "player-a", 1.5));
assert.throws(() =>
  applyLifeBet(createMatch("lifeBetting", 7), "player-a", getMaxLifeBet(7) + 1),
);
assert.throws(() => applyLifeBet(createMatch(), "unknown-player", 1));
assert.throws(() => applyLifeBet(createMatch("cardSelection"), "player-a", 1));

const missingSelectionState = createMatch();
const playerAWithoutSelection: MatchPlayerState = {
  ...missingSelectionState.players[0],
  cardSelection: null,
};
assert.throws(() =>
  applyLifeBet(
    {
      ...missingSelectionState,
      players: [playerAWithoutSelection, missingSelectionState.players[1]],
    },
    "player-a",
    1,
  ),
);

assert.throws(() => applyLifeBet(afterMinimumBet, "player-a", 2));

const afterBothBets = applyLifeBet(afterMinimumBet, "player-b", 4);
assert.equal(afterBothBets.players[0].lifeBet, MIN_LIFE_BET);
assert.equal(afterBothBets.players[1].lifeBet, 4);
assert.equal(afterBothBets.phase, "selectionLocked");
assert.deepEqual(afterBothBets.players[0].cardSelection, playerASelection);
assert.deepEqual(afterBothBets.players[1].cardSelection, playerBSelection);

const insufficientLifeState = createMatch("lifeBetting", 1);
assert.equal(getMaxLifeBet(1), 0);
assert.throws(() => getLifeBettingLimits(insufficientLifeState, "player-a"));
assert.throws(() => applyLifeBet(insufficientLifeState, "player-a", 1));

const stateBeforeInvalidBet = createMatch("lifeBetting", 7);
const playerABeforeInvalidBet = stateBeforeInvalidBet.players[0];
const playerBBeforeInvalidBet = stateBeforeInvalidBet.players[1];
assert.throws(() => applyLifeBet(stateBeforeInvalidBet, "player-a", 4));
assert.equal(stateBeforeInvalidBet.phase, "lifeBetting");
assert.strictEqual(stateBeforeInvalidBet.players[0], playerABeforeInvalidBet);
assert.strictEqual(stateBeforeInvalidBet.players[1], playerBBeforeInvalidBet);
assert.equal(stateBeforeInvalidBet.players[0].lifeBet, null);
assert.equal(stateBeforeInvalidBet.players[1].lifeBet, null);

console.log("match-life-betting: ok");
