import { verifyPassword } from "~~/server/utils/crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null);
  const { email, password } = body || {};

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

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: "Database connection failed.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Retrieve the user by email
  const user = await db
    .prepare("SELECT id, password_hash, is_verified FROM users WHERE email = ?")
    .bind(normalizedEmail)
    .first();

  // General error message to avoid revealing whether the email exists
  const invalidCredentialsError = () =>
    createError({
      statusCode: 401,
      statusMessage: "Invalid email or password.",
    });
  if (!user) {
    throw invalidCredentialsError();
  }

  // 2. Verify the password
  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    throw invalidCredentialsError();
  }

  // 3. Check if the user is verified
  if (user.is_verified !== 1) {
    throw createError({
      statusCode: 403,
      statusMessage:
        "Account not verified. Please check your email for the verification link.",
    });
  }

  // 4. Create a session (7 days expiration)
  const sessionId = crypto.randomUUID();
  const maxAgeSeconds = 7 * 24 * 60 * 60; // 7 days in seconds
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000).toISOString();

  await db
    .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(sessionId, user.id, expiresAt)
    .run();

  // 5. Set the session cookie in an HTTP-only, secure manner
  const host = getRequestHeader(event, "host") || "";
  const isSecure = !host.includes("localhost");

  setCookie(event, "session_id", sessionId, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "strict",
    maxAge: maxAgeSeconds,
    path: "/",
  });

  return {
    success: true,
    message: "Login successful.",
    users: {
      id: user.id,
      email: user.email,
    },
  };
});
