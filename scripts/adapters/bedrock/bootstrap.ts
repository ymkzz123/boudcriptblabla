import { world } from "@minecraft/server";

import { formatLifeUnits } from "../../core/player-life-profile";
import { loadOrCreatePlayerLife } from "./player-life-store";

export function initializeBedrockAdapter(): void {
  world.afterEvents.playerSpawn.subscribe(({ initialSpawn, player }) => {
    if (!initialSpawn) {
      return;
    }

    try {
      const profile = loadOrCreatePlayerLife(player);
      const life = formatLifeUnits(profile.lifeUnits);
      const source = profile.initialized ? "새 수명 데이터 생성" : "저장된 수명 불러옴";

      player.sendMessage(`§7[Cryptbound] ${source}: §f${life}`);
    } catch (error) {
      console.warn(
        `[Cryptbound] Failed to load life for ${player.name}: ${String(error)}`,
      );
      player.sendMessage(
        "§c[Cryptbound] 수명 데이터를 불러오지 못했습니다. 관리자에게 알려주세요.",
      );
    }
  });
}
