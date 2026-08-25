export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, levelId, sentenceId, type, rating } = body;
  // type: 'shadowing' | 'recall'
  // rating: number (e.g. 1 to 5)

  const db = event.context.cloudflare.env.DB;
  const now = Date.now();

  if (type === "shadowing") {
    await db
      .prepare(
        `
      INSERT INTO sentence_progress (user_id, level_id, sentence_id, shadowing_rating, shadowing_updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, sentence_id) DO UPDATE SET
        shadowing_rating = excluded.shadowing_rating,
        shadowing_updated_at = excluded.shadowing_updated_at
    `,
      )
      .bind(userId, levelId, sentenceId, rating, now)
      .run();
  } else if (type === "recall") {
    await db
      .prepare(
        `
      INSERT INTO sentence_progress (user_id, level_id, sentence_id, recall_rating, recall_updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, sentence_id) DO UPDATE SET
        recall_rating = excluded.recall_rating,
        recall_updated_at = excluded.recall_updated_at
    `,
      )
      .bind(userId, levelId, sentenceId, rating, now)
      .run();
  }

  return { success: true };
});
