import {
  EntityComponentTypes,
  ItemStack,
  type Container,
  type Player,
} from "@minecraft/server";

import type { CardId } from "../../core/card";
import {
  getCardIdFromItemTypeId,
  getCardItemTypeId,
} from "../../core/card-item";

function getPlayerInventoryContainer(player: Player): Container {
  const inventory = player.getComponent(EntityComponentTypes.Inventory);
  const container = inventory?.container;

  if (!container) {
    throw new Error("Player inventory container is unavailable.");
  }

  return container;
}

export function clearPlayerCryptboundCards(player: Player): void {
  const container = getPlayerInventoryContainer(player);

  for (let slot = 0; slot < container.size; slot += 1) {
    const itemStack = container.getItem(slot);

    if (
      itemStack !== undefined &&
      getCardIdFromItemTypeId(itemStack.typeId) !== undefined
    ) {
      container.setItem(slot, undefined);
    }
  }
}

export function syncPlayerCardHand(
  player: Player,
  hand: readonly CardId[],
): void {
  const container = getPlayerInventoryContainer(player);
  clearPlayerCryptboundCards(player);

  for (const cardId of hand) {
    const remainder = container.addItem(
      new ItemStack(getCardItemTypeId(cardId), 1),
    );

    if (remainder !== undefined) {
      throw new Error("Not enough inventory space to sync card hand.");
    }
  }
}
