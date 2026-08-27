import { hashPassword } from "~~/server/utils/crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body || {};

  // 1. Strict input validation
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email address format.",
    });
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password must be at least 8 characters long.",
    });
  }

  // 2. Access Cloudflare D1 Binding
  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "D1 database binding is unavailable in the execution context.",
    });
  }

  // 3. Check for existing account
  const existingUser = await db
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(normalizedEmail)
    .first();

  if (existingUser) {
    throw createError({
      status: 409,
      statusMessage: "An account with this email address already exists",
    });
  }

  // 4. Generate Identifiers & Hash
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const verificationToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // 5. Atomic Batch Insertion
  await db.batch([
    db
      .prepare(
        "INSERT INTO users (id, email, password_hash, is_verified) VALUES (?, ?, ?, 0)",
      )
      .bind(userId, normalizedEmail, passwordHash),
    db
      .prepare(
        "INSERT INTO verification_tokens (token, user_id, expires_at) VALUES (?, ?, ?)",
      )
      .bind(verificationToken, userId, expiresAt),
  ]);

  return {
    success: true,
    message: "User successfully registered",
    userId,
    verificationToken, // Remove after development testing
  };
});
