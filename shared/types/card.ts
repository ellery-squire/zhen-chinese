import type { ReviewGrade } from "./review";

export interface ZhCard {
  id: string;
  hanzi: string;
  pinyin: string;
  translation: string;
  audioUrl?: string;
}

export enum VocabularyGrade {
  A1 = "a1",
  A2 = "a2",
  BasicVerbConjugations = "bvc",
  B1 = "b1",
  B2 = "b2",
  MostCommonAdjectives = "mcadj",
  MostCommonAdverbs = "mcadv",
  MostCommonVerbs = "mcv",
  C1 = "c1",
}

export type ZhShadowingCard = ZhCard;
export type ZhRecallCard = ZhCard;
export type ZhCardList = ZhCard[];

export interface SessionCardDTO {
  card: ZhCard;
  isDue: boolean;
  currentEaseFactor: number;
  lastRating?: ReviewGrade;
}

export interface CardRepository {
  getLanguageIslandList(languageIslandId: string): Promise<ZhCardList>;
  getVocabularyList(
    vocabularyGrade: VocabularyGrade,
    partIndex?: number | string,
  ): Promise<ZhCardList>;
}
