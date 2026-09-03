import type { Player } from "@minecraft/server";

import {
  assertValidLifeUnits,
  resolveStoredLifeUnits,
  type ResolvedLifeProfile,
} from "../../core/player-life-profile";

export const PLAYER_LIFE_UNITS_PROPERTY = "cryptbound:life_units";

export function loadOrCreatePlayerLife(
  player: Player,
): ResolvedLifeProfile {
  const storedValue = player.getDynamicProperty(PLAYER_LIFE_UNITS_PROPERTY);
  const profile = resolveStoredLifeUnits(storedValue);

  if (profile.initialized) {
    player.setDynamicProperty(
      PLAYER_LIFE_UNITS_PROPERTY,
      profile.lifeUnits,
    );
  }

  return profile;
}

export function readPlayerLifeUnits(player: Player): number | undefined {
  const storedValue = player.getDynamicProperty(PLAYER_LIFE_UNITS_PROPERTY);

  if (storedValue === undefined) {
    return undefined;
  }

  if (typeof storedValue !== "number") {
    throw new Error("Stored player life units must be a number.");
  }

  return assertValidLifeUnits(storedValue);
}

export function writePlayerLifeUnits(
  player: Player,
  lifeUnits: number,
): void {
  player.setDynamicProperty(
    PLAYER_LIFE_UNITS_PROPERTY,
    assertValidLifeUnits(lifeUnits),
  );
}
