import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { mutateDb, readDb, toPublicUser } from "./store";
import type { PublicUser, User } from "./types";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email";

export const SESSION_COOKIE = "aiforge_session";
const SESSION_DAYS = 30;
const FREE_CREDITS = 120;

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = hashPassword(password, salt);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${hashPassword(password, salt)}`;
}

function sessionExpiry(): Date {
  const date = new Date();
  date.setDate(date.getDate() + SESSION_DAYS);
  return date;
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<PublicUser> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  const existing = await readDb();
  if (existing.users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const verificationToken = generateToken();
  const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const isAdmin = Boolean(adminEmail && email === adminEmail);

  const user: User = {
    id: randomBytes(12).toString("hex"),
    email,
    name,
    passwordHash: createPasswordHash(input.password),
    plan: "free",
    role: isAdmin ? "admin" : "user",
    credits: FREE_CREDITS,
    emailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpiresAt: verificationExpiresAt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await mutateDb((db) => {
    db.users.push(user);
  });

  await sendVerificationEmail(email, verificationToken);

  return toPublicUser(user);
}

export async function authenticate(email: string, password: string): Promise<PublicUser> {
  const db = await readDb();
  const user = db.users.find((u) => u.email === email.trim().toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error("Invalid email or password.");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail && user.email === adminEmail && user.role !== "admin") {
    return mutateDb((database) => {
      const u = database.users.find((x) => x.id === user.id);
      if (u) {
        u.role = "admin";
        u.updatedAt = new Date().toISOString();
      }
      return toPublicUser(u ?? user);
    });
  }

  return toPublicUser(user);
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = sessionExpiry().toISOString();

  await mutateDb((db) => {
    db.sessions = db.sessions.filter((s) => new Date(s.expiresAt).getTime() > Date.now());
    db.sessions.push({ token, userId, expiresAt });
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await mutateDb((db) => {
      db.sessions = db.sessions.filter((s) => s.token !== token);
    });
  }
  store.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const db = await readDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) return null;

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) return null;

  return toPublicUser(user);
}

export async function verifyEmail(token: string): Promise<PublicUser> {
  const db = await readDb();
  const user = db.users.find(
    (u) => u.emailVerificationToken === token && u.emailVerificationExpiresAt,
  );
  if (!user) throw new Error("Invalid verification token.");
  if (new Date(user.emailVerificationExpiresAt!).getTime() <= Date.now()) {
    throw new Error("Verification token has expired.");
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiresAt = undefined;
  user.updatedAt = new Date().toISOString();

  await mutateDb((db) => {
    const u = db.users.find((u) => u.id === user.id);
    if (u) {
      u.emailVerified = true;
      u.emailVerificationToken = undefined;
      u.emailVerificationExpiresAt = undefined;
      u.updatedAt = new Date().toISOString();
    }
  });

  return toPublicUser(user);
}

export async function resendVerification(email: string): Promise<void> {
  const db = await readDb();
  const user = db.users.find((u) => u.email === email.trim().toLowerCase());
  if (!user) throw new Error("No account found with that email.");
  if (user.emailVerified) throw new Error("Email already verified.");

  const token = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  user.emailVerificationToken = token;
  user.emailVerificationExpiresAt = expires;
  user.updatedAt = new Date().toISOString();

  await mutateDb((db) => {
    const u = db.users.find((u) => u.id === user.id);
    if (u) {
      u.emailVerificationToken = token;
      u.emailVerificationExpiresAt = expires;
      u.updatedAt = new Date().toISOString();
    }
  });

  await sendVerificationEmail(user.email, token);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const db = await readDb();
  const user = db.users.find((u) => u.email === email.trim().toLowerCase());
  if (!user) return;

  const token = generateToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  user.passwordResetToken = token;
  user.passwordResetExpiresAt = expires;
  user.updatedAt = new Date().toISOString();

  await mutateDb((db) => {
    const u = db.users.find((u) => u.id === user.id);
    if (u) {
      u.passwordResetToken = token;
      u.passwordResetExpiresAt = expires;
      u.updatedAt = new Date().toISOString();
    }
  });

  await sendPasswordResetEmail(user.email, token);
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const db = await readDb();
  const user = db.users.find(
    (u) => u.passwordResetToken === token && u.passwordResetExpiresAt,
  );
  if (!user) throw new Error("Invalid or expired reset token.");
  if (new Date(user.passwordResetExpiresAt!).getTime() <= Date.now()) {
    throw new Error("Reset token has expired.");
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) throw new Error(passwordError);

  const passwordHash = createPasswordHash(newPassword);

  await mutateDb((db) => {
    const u = db.users.find((row) => row.id === user.id);
    if (u) {
      u.passwordHash = passwordHash;
      u.passwordResetToken = undefined;
      u.passwordResetExpiresAt = undefined;
      u.updatedAt = new Date().toISOString();
    }
    db.sessions = db.sessions.filter((s) => s.userId !== user.id);
  });
}

export async function updateUserPlan(
  userId: string,
  planId: "free" | "pro" | "business",
  credits?: number,
) {
  return mutateDb(async (db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");
    user.plan = planId;
    if (credits !== undefined) user.credits = credits;
    user.updatedAt = new Date().toISOString();
    return toPublicUser(user);
  });
}

export async function addCredits(userId: string, amount: number) {
  return mutateDb(async (db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");
    user.credits += amount;
    user.updatedAt = new Date().toISOString();
    return toPublicUser(user);
  });
}

export async function setCredits(userId: string, credits: number) {
  if (!Number.isFinite(credits) || credits < 0) {
    throw new Error("Credits must be a non-negative number.");
  }
  return mutateDb(async (db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");
    user.credits = Math.round(credits);
    user.updatedAt = new Date().toISOString();
    return toPublicUser(user);
  });
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  return mutateDb(async (db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");
    user.role = role;
    user.updatedAt = new Date().toISOString();
    return toPublicUser(user);
  });
}

export async function deleteUser(userId: string) {
  await mutateDb((db) => {
    db.users = db.users.filter((u) => u.id !== userId);
    db.sessions = db.sessions.filter((s) => s.userId !== userId);
    db.history = db.history.filter((h) => h.userId !== userId);
  });
}

export async function listUsers() {
  const db = await readDb();
  return db.users.map(toPublicUser);
}

export async function getUserStats() {
  const db = await readDb();
  const planCounts: Record<string, number> = { free: 0, pro: 0, business: 0 };
  for (const u of db.users) {
    planCounts[u.plan] = (planCounts[u.plan] ?? 0) + 1;
  }
  return {
    totalUsers: db.users.length,
    totalGenerations: db.history.length,
    totalCreditsUsed: db.history.reduce((sum, h) => sum + h.cost, 0),
    planCounts,
  };
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Enter a valid email address.";
  }
  return null;
}
