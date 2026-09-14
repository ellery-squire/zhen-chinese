export default defineEventHandler(async (event) => {
  const { token } = await readBody(event);
  if (!token || typeof token !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Token is required!" });
  }

  const db = event.context.cloudflare?.env?.DB;

  // 1. Look up the token in D1
  const record = await db
    .prepare(
      "SELECT user_id, expires_at FROM verification_tokens WHERE token = ?",
    )
    .bind(token)
    .first();

  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or already used verification link.",
    });
  }

  // 2. Check for expiration
  if (new Date(record.expires_at as string) < new Date()) {
    // Optional: Delete the expired token to keep the database clean
    await db
      .prepare("DELETE FROM verification_tokens WHERE token = ?")
      .bind(token)
      .run();
    throw createError({
      status: 400,
      statusMessage: "Verification link has expired. Please request a new one.",
    });
  }

  // 3. Atomically update the user and purge the token
  await db.batch([
    db
      .prepare("UPDATE users SET is_verified = 1 WHERE id = ?")
      .bind(record.user_id),
    db.prepare("DELETE FROM verification_tokens WHERE token = ?").bind(token),
  ]);

  return {success: true, message: "Account verified successfully."}
});
