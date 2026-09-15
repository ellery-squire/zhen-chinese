export default defineEventHandler(async (event) => {
  // 1. Retrieve the session ID from cookies
  const sessionId = getCookie(event, "session_id");

  // 2. If a session ID exists, delete the session from the database
  if (sessionId) {
    const db = event.context.cloudflare?.env?.DB;
    if (db) {
      try {
        await db
          .prepare("DELETE FROM sessions WHERE id = ?")
          .bind(sessionId)
          .run();
      } catch (error) {
        console.error("Error deleting session from database:", error);
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to delete session from database.",
        });
      }
    }
  }

  // 3. Delete the cookie from the client
  deleteCookie(event, "session_id", {
    path: "/",
  });

  return { success: true, message: "Logged out successfully." };
});
