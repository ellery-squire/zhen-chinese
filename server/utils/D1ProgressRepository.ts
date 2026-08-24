import type { ZhCard, VocabularyGrade } from "#shared/types/card";
import type { ProgressRecord } from "#shared/types/review";

// server/utils/D1ProgressRepository.ts

export async function getRecordsByCardIds(
  userId: string,
  cardIds: string[],
): Promise<ProgressRecord[]> {
  if (cardIds.length === 0) return [];

  // Creates a string of placeholders: "?, ?, ?"
  const placeholders = cardIds.map(() => "?").join(", ");

  // SELECT ... WHERE card_id IN (?, ?, ?)
  const query = `
    SELECT 
      card_id as cardId,
      interval_days as intervalDays, 
      ease_factor as easeFactor, 
      repetitions_count as repetitionsCount, 
      next_review_at as nextReviewAt 
    FROM user_progress 
    WHERE user_id = ? AND card_id IN (${placeholders})
  `;

  // Bind the userId first, then spread the array of cardIds
  const { results } = await this.db
    .prepare(query)
    .bind(userId, ...cardIds)
    .all();

  return results as ProgressRecord[];
}
