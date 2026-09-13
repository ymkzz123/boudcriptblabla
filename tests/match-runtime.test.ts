import { strict as assert } from "node:assert";

import type { CardId } from "../scripts/core/card";
import type { CardSelectionResult } from "../scripts/core/card-selection";
import type {
  MatchPhase,
  MatchPlayerState,
  MatchState,
} from "../scripts/core/match-state";
import { runCardSelectionFlow } from "../scripts/runtime/card-selection-flow";
import { MatchController } from "../scripts/runtime/match-controller";

interface Deferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
}

function createDeferred<T>(): Deferred<T> {
  let resolvePromise!: (value: T) => void;
  const promise = new Promise<T>((resolve) => {
    resolvePromise = resolve;
  });

  return { promise, resolve: resolvePromise };
}

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
    matchId: "match-runtime-1",
    phase,
    round: 1,
    players: [
      createPlayer("player-a", ["swallow", "deer", "swallow"]),
      createPlayer("player-b", ["crane", "boar", "butterfly"]),
    ],
  };
}

const playerASelection: CardSelectionResult = {
  selectedCard: "swallow",
  handIndex: 2,
};
const playerBSelection: CardSelectionResult = {
  selectedCard: "boar",
  handIndex: 1,
};

async function runTests(): Promise<void> {
  const initialState = createMatch();
  const initialController = new MatchController(initialState);
  assert.strictEqual(initialController.getState(), initialState);

  const afterValidSelection = await initialController.submitCardSelection(
    "player-a",
    playerASelection,
  );
  assert.deepEqual(afterValidSelection.players[0].cardSelection, playerASelection);
  assert.strictEqual(initialController.getState(), afterValidSelection);

  const stateBeforeFailure = initialController.getState();
  await assert.rejects(() =>
    initialController.submitCardSelection("player-a", playerASelection),
  );
  assert.strictEqual(initialController.getState(), stateBeforeFailure);
  await initialController.submitCardSelection("player-b", playerBSelection);
  assert.equal(initialController.getState().phase, "lifeBetting");

  const sequentialController = new MatchController(createMatch());
  await sequentialController.submitCardSelection("player-a", playerASelection);
  await sequentialController.submitCardSelection("player-b", playerBSelection);
  assert.deepEqual(
    sequentialController.getState().players[0].cardSelection,
    playerASelection,
  );
  assert.deepEqual(
    sequentialController.getState().players[1].cardSelection,
    playerBSelection,
  );
  assert.equal(sequentialController.getState().phase, "lifeBetting");

  const queuedController = new MatchController(createMatch());
  await Promise.all([
    queuedController.submitCardSelection("player-a", playerASelection),
    queuedController.submitCardSelection("player-b", playerBSelection),
  ]);
  assert.deepEqual(queuedController.getState().players[0].cardSelection, playerASelection);
  assert.deepEqual(queuedController.getState().players[1].cardSelection, playerBSelection);
  assert.equal(queuedController.getState().phase, "lifeBetting");

  const canceledController = new MatchController(createMatch());
  const stateBeforeCancellation = canceledController.getState();
  const canceledResult = await runCardSelectionFlow(
    canceledController,
    "player-a",
    async () => undefined,
  );
  assert.equal(canceledResult, "canceled");
  assert.strictEqual(canceledController.getState(), stateBeforeCancellation);

  const concurrentController = new MatchController(createMatch());
  const playerAResponse = createDeferred<CardSelectionResult | undefined>();
  const playerBResponse = createDeferred<CardSelectionResult | undefined>();
  const playerAFlow = runCardSelectionFlow(
    concurrentController,
    "player-a",
    () => playerAResponse.promise,
  );
  const playerBFlow = runCardSelectionFlow(
    concurrentController,
    "player-b",
    () => playerBResponse.promise,
  );

  playerBResponse.resolve(playerBSelection);
  assert.equal(await playerBFlow, "submitted");
  assert.equal(concurrentController.getState().phase, "cardSelection");
  playerAResponse.resolve(playerASelection);
  assert.equal(await playerAFlow, "submitted");
  assert.deepEqual(
    concurrentController.getState().players[0].cardSelection,
    playerASelection,
  );
  assert.deepEqual(
    concurrentController.getState().players[1].cardSelection,
    playerBSelection,
  );
  assert.equal(concurrentController.getState().phase, "lifeBetting");

  const staleController = new MatchController(createMatch());
  const firstResponse = createDeferred<CardSelectionResult | undefined>();
  const staleResponse = createDeferred<CardSelectionResult | undefined>();
  const firstFlow = runCardSelectionFlow(
    staleController,
    "player-a",
    () => firstResponse.promise,
  );
  const staleFlow = runCardSelectionFlow(
    staleController,
    "player-a",
    () => staleResponse.promise,
  );

  firstResponse.resolve(playerASelection);
  assert.equal(await firstFlow, "submitted");
  const stateAfterFirstResponse = staleController.getState();
  staleResponse.resolve({ selectedCard: "deer", handIndex: 1 });
  await assert.rejects(() => staleFlow);
  assert.strictEqual(staleController.getState(), stateAfterFirstResponse);
  assert.deepEqual(
    staleController.getState().players[0].cardSelection,
    playerASelection,
  );

  console.log("match-runtime: ok");
}

void runTests().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
