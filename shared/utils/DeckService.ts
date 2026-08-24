import type {
  CardRepository,
  ZhCard,
  SessionCardDTO,
  VocabularyGrade,
} from "../types/card";
import type { ProgressRepository, ProgressRecord } from "../types/review";

export class DeckService {
  constructor(
    private readonly cardRepo: CardRepository,
    private readonly progressRepo: ProgressRepository,
  ) {}
  /**
   * Fetches an entire vocabulary list and attaches the user's specific progress to it.
   * Perfect for displaying a grid of cards in the UI before a study session begins.
   */
  public async getDeckOverview(
    userId: string,
    grade: VocabularyGrade,
    partIndex?: number,
  ): Promise<SessionCardDTO[]> {
    // 1. Fetch all 200 static cards (1 Database Call)
    const cards = await this.cardRepo.getVocabularyList(grade, partIndex);
    // Extract just the IDs: ['card-1', 'card-2', ...]
    const cardIds = cards.map((c) => c.id);
    // 2. Fetch all progress records for those 200 cards (1 Database Call)
    const progressRecords = await this.progressRepo.getRecordsByCardIds(
      userId,
      cardIds,
    );
    // 3. Create a dictionary/hashmap for instant lookups
    // Example: { 'card-1': { easeFactor: 2.5, ... }, 'card-2': { ... } }
    const progressMap = new Map<string, ProgressRecord>();
    for (const record of progressRecords) {
      progressMap.set(record.cardId, record);
    }

    const now = Date.now();

    // 4. Merge them together in one fast pass
    return cards.map((card) => {
      const progress = progressMap.get(card.id);

      return {
        card: card,
        // If progress exists, check if it's due. If it doesn't exist, it's a new card (due).
        isDue: progress ? progress.nextReviewAt <= now : true,
        currentEaseFactor: progress ? progress.easeFactor : 2.5,
        // You can also pass the full progress object if the UI needs it
        progress: progress || null,
      };
    });
  }
}
