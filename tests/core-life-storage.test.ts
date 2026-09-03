import { strict as assert } from "node:assert";

import { getLifeState, lifeToUnits, unitsToLife } from "../scripts/core/life";
import {
  formatLifeUnits,
  resolveStoredLifeUnits,
} from "../scripts/core/player-life-profile";

function assertThrows(action: () => void): void {
  let threw = false;

  try {
    action();
  } catch {
    threw = true;
  }

  assert.equal(threw, true);
}

const firstJoin = resolveStoredLifeUnits(undefined);
assert.equal(firstJoin.initialized, true);
assert.equal(firstJoin.lifeUnits, 20);
assert.equal(firstJoin.state, "active");

const returningPlayer = resolveStoredLifeUnits(15);
assert.equal(returningPlayer.initialized, false);
assert.equal(returningPlayer.lifeUnits, 15);
assert.equal(returningPlayer.state, "active");
assert.equal(formatLifeUnits(returningPlayer.lifeUnits), "7.5");

assert.equal(lifeToUnits(10), 20);
assert.equal(lifeToUnits(7.5), 15);
assert.equal(unitsToLife(15), 7.5);

assert.equal(getLifeState(0), "zeroLifeRecovery");
assert.equal(getLifeState(1), "halfLifeRecovery");
assert.equal(getLifeState(2), "active");

assertThrows(() => resolveStoredLifeUnits(-1));
assertThrows(() => resolveStoredLifeUnits(1.5));
assertThrows(() => resolveStoredLifeUnits("20"));

console.log("core-life-storage: ok");
