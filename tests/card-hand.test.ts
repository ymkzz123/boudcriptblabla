import { strict as assert } from "node:assert";

import {
  getCardIdFromItemTypeId,
  getCardItemTypeId,
  isCryptboundCardItem,
} from "../scripts/core/card-item";
import { selectCardFromHand } from "../scripts/core/card-selection";

assert.equal(getCardItemTypeId("swallow"), "cryptbound:card_swallow");
assert.equal(
  getCardIdFromItemTypeId("cryptbound:card_butterfly"),
  "butterfly",
);
assert.equal(getCardIdFromItemTypeId("minecraft:paper"), undefined);
assert.equal(isCryptboundCardItem("cryptbound:card_boar"), true);
assert.equal(isCryptboundCardItem("minecraft:paper"), false);

const hand = ["swallow", "deer", "swallow"] as const;
const selected = selectCardFromHand(hand, "swallow");
assert.equal(selected.selectedCard, "swallow");
assert.equal(selected.handIndex, 0);

assert.throws(() => selectCardFromHand(hand, "crane"));

console.log("card-hand: ok");
