import { strict as assert } from "node:assert";

import type { CardId } from "../scripts/core/card";
import type { CardSelectionResult } from "../scripts/core/card-selection";
import { getMaxLifeBet } from "../scripts/core/life";
import type { MatchPlayerState, MatchState } from "../scripts/core/match-state";
import { MIN_LIFE_BET } from "../scripts/core/rules";
import { runLifeBettingFlow } from "../scripts/runtime/life-betting-flow";
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
  cardSelection: CardSelectionResult,
): MatchPlayerState {
  return {
    playerId,
    lifeUnits: 20,
    deck: [],
    hand,
    usedCards: [],
    cardSelection,
    lifeBet: null,
  };
}

function createMatch(): MatchState {
  return {
    matchId: "match-life-betting-runtime-1",
    phase: "lifeBetting",
    round: 1,
    players: [
      createPlayer(
        "player-a",
        ["swallow", "deer", "swallow"],
        playerASelection,
      ),
      createPlayer(
        "player-b",
        ["crane", "boar", "butterfly"],
        playerBSelection,
      ),
    ],
  };
}

async function runTests(): Promise<void> {
  const controller = new MatchController(createMatch());
  assert.deepEqual(controller.getLifeBettingLimits("player-a"), {
    currentLife: 10,
    minLifeBet: MIN_LIFE_BET,
    maxLifeBet: getMaxLifeBet(20),
  });

  const afterValidBet = await controller.submitLifeBet("player-a", 3);
  assert.equal(afterValidBet.players[0].lifeBet, 3);
  assert.strictEqual(controller.getState(), afterValidBet);

  const stateBeforeFailure = controller.getState();
  await assert.rejects(() => controller.submitLifeBet("player-a", 5));
  assert.strictEqual(controller.getState(), stateBeforeFailure);
  await controller.submitLifeBet("player-b", 4);
  assert.equal(controller.getState().phase, "selectionLocked");

  const rejectedBetController = new MatchController(createMatch());
  const stateBeforeRejectedBet = rejectedBetController.getState();
  await assert.rejects(() => rejectedBetController.submitLifeBet("player-a", 0));
  assert.strictEqual(rejectedBetController.getState(), stateBeforeRejectedBet);
  await rejectedBetController.submitLifeBet("player-a", 2);
  assert.equal(rejectedBetController.getState().players[0].lifeBet, 2);

  const sequentialController = new MatchController(createMatch());
  await sequentialController.submitLifeBet("player-a", 2);
  await sequentialController.submitLifeBet("player-b", 5);
  assert.equal(sequentialController.getState().players[0].lifeBet, 2);
  assert.equal(sequentialController.getState().players[1].lifeBet, 5);
  assert.equal(sequentialController.getState().phase, "selectionLocked");

  const queuedController = new MatchController(createMatch());
  await Promise.all([
    queuedController.submitLifeBet("player-a", 3),
    queuedController.submitLifeBet("player-b", 4),
  ]);
  assert.equal(queuedController.getState().players[0].lifeBet, 3);
  assert.equal(queuedController.getState().players[1].lifeBet, 4);
  assert.equal(queuedController.getState().phase, "selectionLocked");

  const canceledController = new MatchController(createMatch());
  const stateBeforeCancellation = canceledController.getState();
  const canceledResult = await runLifeBettingFlow(
    canceledController,
    "player-a",
    async () => undefined,
  );
  assert.equal(canceledResult, "canceled");
  assert.strictEqual(canceledController.getState(), stateBeforeCancellation);

  const concurrentController = new MatchController(createMatch());
  const playerAResponse = createDeferred<number | undefined>();
  const playerBResponse = createDeferred<number | undefined>();
  const playerAFlow = runLifeBettingFlow(
    concurrentController,
    "player-a",
    () => playerAResponse.promise,
  );
  const playerBFlow = runLifeBettingFlow(
    concurrentController,
    "player-b",
    () => playerBResponse.promise,
  );

  playerBResponse.resolve(4);
  assert.equal(await playerBFlow, "submitted");
  assert.equal(concurrentController.getState().phase, "lifeBetting");
  playerAResponse.resolve(3);
  assert.equal(await playerAFlow, "submitted");
  assert.equal(concurrentController.getState().players[0].lifeBet, 3);
  assert.equal(concurrentController.getState().players[1].lifeBet, 4);
  assert.equal(concurrentController.getState().phase, "selectionLocked");
  assert.deepEqual(
    concurrentController.getState().players[0].cardSelection,
    playerASelection,
  );
  assert.deepEqual(
    concurrentController.getState().players[1].cardSelection,
    playerBSelection,
  );

  const staleController = new MatchController(createMatch());
  const firstResponse = createDeferred<number | undefined>();
  const staleResponse = createDeferred<number | undefined>();
  const firstFlow = runLifeBettingFlow(
    staleController,
    "player-a",
    () => firstResponse.promise,
  );
  const staleFlow = runLifeBettingFlow(
    staleController,
    "player-a",
    () => staleResponse.promise,
  );

  firstResponse.resolve(3);
  assert.equal(await firstFlow, "submitted");
  const stateAfterFirstResponse = staleController.getState();
  staleResponse.resolve(5);
  await assert.rejects(() => staleFlow);
  assert.strictEqual(staleController.getState(), stateAfterFirstResponse);
  assert.equal(staleController.getState().players[0].lifeBet, 3);

  const phaseChangedController = new MatchController(createMatch());
  const lateResponse = createDeferred<number | undefined>();
  const lateFlow = runLifeBettingFlow(
    phaseChangedController,
    "player-a",
    () => lateResponse.promise,
  );
  await phaseChangedController.submitLifeBet("player-a", 2);
  await phaseChangedController.submitLifeBet("player-b", 4);
  const lockedState = phaseChangedController.getState();
  lateResponse.resolve(6);
  await assert.rejects(() => lateFlow);
  assert.strictEqual(phaseChangedController.getState(), lockedState);
  assert.equal(phaseChangedController.getState().phase, "selectionLocked");
  assert.equal(phaseChangedController.getState().players[0].lifeBet, 2);

  console.log("life-betting-runtime: ok");
}

void runTests().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
