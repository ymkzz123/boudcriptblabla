export const CARD_IDS = [
  "swallow",
  "crane",
  "deer",
  "butterfly",
  "boar",
] as const;

export type CardId = (typeof CARD_IDS)[number];
export type CardGrade = "S" | "A" | "B" | "C" | "D";
export type CardEffectTiming =
  | "preReveal"
  | "lifeSettlement"
  | "postRound"
  | "priorityNullify";

export interface CardDefinition {
  readonly id: CardId;
  readonly itemTypeId: string;
  readonly displayName: string;
  readonly grade: CardGrade;
  readonly baseScore: number;
  readonly effectTiming: CardEffectTiming;
}

export const CARD_DEFINITIONS: Readonly<Record<CardId, CardDefinition>> = {
  swallow: {
    id: "swallow",
    itemTypeId: "cryptbound:card_swallow",
    displayName: "제비",
    grade: "B",
    baseScore: 6,
    effectTiming: "preReveal",
  },
  crane: {
    id: "crane",
    itemTypeId: "cryptbound:card_crane",
    displayName: "두루미",
    grade: "A",
    baseScore: 8,
    effectTiming: "lifeSettlement",
  },
  deer: {
    id: "deer",
    itemTypeId: "cryptbound:card_deer",
    displayName: "사슴",
    grade: "C",
    baseScore: 4,
    effectTiming: "preReveal",
  },
  butterfly: {
    id: "butterfly",
    itemTypeId: "cryptbound:card_butterfly",
    displayName: "나비",
    grade: "S",
    baseScore: 10,
    effectTiming: "postRound",
  },
  boar: {
    id: "boar",
    itemTypeId: "cryptbound:card_boar",
    displayName: "멧돼지",
    grade: "D",
    baseScore: 2,
    effectTiming: "priorityNullify",
  },
};

export function getCardDefinition(cardId: CardId): CardDefinition {
  return CARD_DEFINITIONS[cardId];
}
