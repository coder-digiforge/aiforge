import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import type { Database, User, PublicUser } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const TMP_FILE = path.join(DATA_DIR, "db.json.tmp");

const EMPTY_DB: Database = { users: [], sessions: [], history: [] };

let fileCache: Database | null = null;
let fileWriteQueue: Promise<void> = Promise.resolve();
let schemaReady: Promise<void> | null = null;

function databaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return undefined;
  // channel_binding breaks some serverless drivers
  return raw
    .replace(/&channel_binding=require/gi, "")
    .replace(/\?channel_binding=require&/gi, "?")
    .replace(/\?channel_binding=require$/gi, "");
}

function hasPostgres(): boolean {
  return Boolean(databaseUrl());
}

function getSql() {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

function migrateUser(user: Partial<User> & { id: string; email: string; name: string }): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash ?? "",
    plan: user.plan ?? "free",
    role: user.role ?? "user",
    credits: user.credits ?? 120,
    emailVerified: user.emailVerified ?? false,
    emailVerificationToken: user.emailVerificationToken,
    emailVerificationExpiresAt: user.emailVerificationExpiresAt,
    passwordResetToken: user.passwordResetToken,
    passwordResetExpiresAt: user.passwordResetExpiresAt,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    createdAt: user.createdAt ?? new Date().toISOString(),
    updatedAt: user.updatedAt ?? new Date().toISOString(),
  };
}

function normalizeDb(raw: Partial<Database> | null | undefined): Database {
  return {
    users: (raw?.users ?? []).map(migrateUser),
    sessions: raw?.sessions ?? [],
    history: raw?.history ?? [],
    plans: raw?.plans,
    stripeEvents: raw?.stripeEvents,
  };
}

async function ensurePostgresSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS aiforge_store (
          id integer PRIMARY KEY CHECK (id = 1),
          data jsonb NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `;
      const rows = await sql`SELECT 1 AS ok FROM aiforge_store WHERE id = 1`;
      if (rows.length === 0) {
        await sql`
          INSERT INTO aiforge_store (id, data)
          VALUES (1, ${JSON.stringify(EMPTY_DB)}::jsonb)
        `;
      }
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
}

async function ensureFile(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DB_FILE, "utf8");
  } catch {
    await writeFile(DB_FILE, JSON.stringify(EMPTY_DB, null, 2), "utf8");
  }
}

async function readDbFile(): Promise<Database> {
  if (fileCache) return fileCache;
  await ensureFile();
  const raw = await readFile(DB_FILE, "utf8");
  try {
    fileCache = normalizeDb(JSON.parse(raw) as Partial<Database>);
  } catch {
    fileCache = { ...EMPTY_DB };
  }
  return fileCache;
}

async function writeDbFile(db: Database): Promise<void> {
  fileCache = db;
  fileWriteQueue = fileWriteQueue.then(async () => {
    await ensureFile();
    await writeFile(TMP_FILE, JSON.stringify(db, null, 2), "utf8");
    await rename(TMP_FILE, DB_FILE);
  });
  await fileWriteQueue;
}

async function readDbPostgres(): Promise<Database> {
  await ensurePostgresSchema();
  const sql = getSql();
  const rows = await sql`SELECT data FROM aiforge_store WHERE id = 1`;
  const data = rows[0]?.data as Partial<Database> | undefined;
  return normalizeDb(data);
}

async function writeDbPostgres(db: Database): Promise<void> {
  await ensurePostgresSchema();
  const sql = getSql();
  await sql`
    INSERT INTO aiforge_store (id, data, updated_at)
    VALUES (1, ${JSON.stringify(db)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE
    SET data = EXCLUDED.data, updated_at = now()
  `;
}

/** True when using Postgres via DATABASE_URL (required for Vercel / multi-instance). */
export function isPostgresStore(): boolean {
  return hasPostgres();
}

export async function readDb(): Promise<Database> {
  return hasPostgres() ? readDbPostgres() : readDbFile();
}

export async function writeDb(db: Database): Promise<void> {
  if (hasPostgres()) {
    await writeDbPostgres(db);
    return;
  }
  await writeDbFile(db);
}

export async function mutateDb<T>(fn: (db: Database) => T | Promise<T>): Promise<T> {
  if (!hasPostgres()) {
    const db = await readDbFile();
    const result = await fn(db);
    await writeDbFile(db);
    return result;
  }

  // HTTP driver (reliable on Vercel): read → mutate → write
  const db = await readDbPostgres();
  const result = await fn(db);
  await writeDbPostgres(db);
  return result;
}

export function toPublicUser(user: Database["users"][number]): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    role: user.role,
    credits: user.credits,
    emailVerified: user.emailVerified,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    createdAt: user.createdAt,
  };
}
