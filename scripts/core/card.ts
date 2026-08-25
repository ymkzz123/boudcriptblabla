export const CARD_IDS = [
  "swallow",
  "crane",
  "deer",
  "butterfly",
  "boar",
] as const;

export type CardId = (typeof CARD_IDS)[number];

export interface CardDefinition {
  readonly id: CardId;
  readonly displayName: string;
}
