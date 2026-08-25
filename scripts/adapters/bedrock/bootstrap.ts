import { world } from "@minecraft/server";

export function initializeBedrockAdapter(): void {
  world.afterEvents.playerSpawn.subscribe(({ initialSpawn, player }) => {
    if (!initialSpawn) {
      return;
    }

    player.sendMessage("§7[Cryptbound] 애드온 기초 구조가 로드되었습니다.");
    player.sendMessage("§8게임 규칙은 아직 적용되지 않았습니다.");
  });
}
