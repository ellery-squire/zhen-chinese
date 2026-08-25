// import type { ReviewGrade } from "./review";

export interface User {
  id: string;
  email: string;
  createdAt: number;
  lastLoginAt?: number;
}

export interface ZhCard {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  audio?: string;
}

export interface SentenceProgress {
  userId: string;
  levelId: string;
  sentenceId: string;
  shadowingRating: number | null;
  recallRating: number | null;
  shadowingUpdatedAt: number | null;
  recallUpdatedAt: number | null;
}

// Merged type used inside your study cards
export interface PracticeCard extends ZhCard {
  progress?: {
    shadowingRating: number | null;
    recallRating: number | null;
  };
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

export type ZhShadowingCard = PracticeCard;
export type ZhRecallCard = PracticeCard;
export type ZhCardList = PracticeCard[];

// export interface SessionCardDTO {
//   card: ZhCard;
//   isDue: boolean;
//   currentEaseFactor: number;
//   lastRating?: ReviewGrade;
// }

export interface CardRepository {
  getLanguageIslandList(languageIslandId: string): Promise<ZhCardList>;
  getVocabularyList(
    vocabularyGrade: VocabularyGrade,
    partIndex?: number | string,
  ): Promise<ZhCardList>;
}
