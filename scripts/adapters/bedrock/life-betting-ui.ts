import type { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

import type { LifeBettingLimits } from "../../core/match-life-betting";

function createLifeBetChoices(
  minLifeBet: number,
  maxLifeBet: number,
): number[] {
  if (
    !Number.isInteger(minLifeBet) ||
    !Number.isInteger(maxLifeBet) ||
    minLifeBet > maxLifeBet
  ) {
    throw new Error("Cannot show life betting form with an invalid range.");
  }

  const choices: number[] = [];

  for (let lifeBet = minLifeBet; lifeBet <= maxLifeBet; lifeBet += 1) {
    choices.push(lifeBet);
  }

  return choices;
}

export async function showLifeBettingForm(
  player: Player,
  limits: LifeBettingLimits,
): Promise<number | undefined> {
  const choices = createLifeBetChoices(
    limits.minLifeBet,
    limits.maxLifeBet,
  );
  const form = new ModalFormData()
    .title("§l수명 배팅")
    .dropdown(
      `§f현재 수명: §a${limits.currentLife}\n§f배팅 가능 범위: §e${limits.minLifeBet}~${limits.maxLifeBet}\n§f이번 라운드에 걸 수명을 선택하세요.`,
      choices.map((lifeBet) => `${lifeBet} 수명`),
      { defaultValueIndex: 0 },
    )
    .submitButton("배팅 확정");

  const response = await form.show(player);

  if (response.canceled) {
    return undefined;
  }

  const selectedIndex = response.formValues?.[0];

  if (
    typeof selectedIndex !== "number" ||
    !Number.isInteger(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= choices.length
  ) {
    throw new Error("Life betting form returned an invalid selection.");
  }

  return choices[selectedIndex];
}
