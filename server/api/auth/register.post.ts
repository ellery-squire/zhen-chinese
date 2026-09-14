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

  // 1. Construct the dynamic URL
  // Use headers to dynamically get the current domain (localhost or production)
  const host = getRequestHeader(event, "host") || "localhost:3000";
  const protocol = host?.includes("localhost") ? "http" : "https";
  const verifyUrl = `${protocol}://${host}/validate/${verificationToken}`;

  // Print to terminal for instant local testing without waiting for an email
  console.log("\n----------------------------------------");
  console.log("🔗 LOCAL VERIFICATION LINK:");
  console.log(verifyUrl);
  console.log("----------------------------------------\n");

  // 2. Dispatch the email using a transactional API (e.g., Resend)
  // Ensure you set EMAIL_API_KEY via `npx wrangler secret put EMAIL_API_KEY`
  const emailApiKey = event.context.cloudflare?.env?.EMAIL_API_KEY as
    | string
    | undefined;

  if (emailApiKey) {
    try {
      const response = await $fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${emailApiKey}`,
          "Content-Type": "application/json",
        },
        body: {
          from: "Zhen Chinese <onboarding@resend.dev>",
          to: [normalizedEmail],
          subject: "Verify your Zhen Chinese Account",
          html: `
        <div style="font-family: system-ui, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">Welcome to Zhen Chinese</h1>
            <p>Please confirm your identity to activate your account.</p>
            <a href="${verifyUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #dc2626; color: #ffffff; text-decoration: none; font-weight: bold; letter-spacing: 1px;">VERIFY ACCOUNT</a>
          </div>
          `,
        },
      });
      // Log the response for debugging purposes Remove later
      console.log("📧 Resend Response:", response);
    } catch (err) {
      console.error("Email dispatch failed:", err);
    }
  } else {
    console.warn(
      "⚠️ EMAIL_API_KEY is not set. Email dispatch skipped. Please set the environment variable for email functionality.",
    );
  }

  return {
    success: true,
    message: "Registration successful. Please check your email.",
  };
});
