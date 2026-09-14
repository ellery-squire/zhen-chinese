export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, "auth_session");
  if (!sessionId) {
    return { user: null };
  }

  const db = event.context.cloudflare?.env?.DB;

  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: "Database connection failed.",
    });
  }

  const result = await db
    .prepare(
      `
    SELECT users.id, users.email, users.is_verified, sessions.expires_at
      FROM sessions
      INNER JOIN users ON sessions.user_id = users.id
      WHERE sessions.id = ?`,
    )
    .bind(sessionId)
    .first();

    if (!result){
        deleteCookie(event, "auth_session");
        return { user: null }; 
    }

    // Check if the session has expired
    if (new Date(result.expires_at as string) < new Date()) {
        await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
        deleteCookie(event, "auth_session");
        return { user: null };
    }

    return{
        user:{
            id: result.id,
            email: result.email,
            is_verified: result.is_verified === 1,
        }
    }
});
