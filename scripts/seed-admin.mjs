import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { randomBytes, scryptSync } from "node:crypto";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function normalizeDatabaseUrl(raw) {
  return raw
    .replace(/&channel_binding=require/gi, "")
    .replace(/\?channel_binding=require&/gi, "?")
    .replace(/\?channel_binding=require$/gi, "");
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const EMAIL = "admin@aiforge.local";
const PASSWORD = "Admin1234";
const NAME = "Admin";

loadEnv();

const now = new Date().toISOString();
const passwordHash = hashPassword(PASSWORD);

function upsertAdmin(db) {
  db.users = db.users ?? [];
  db.sessions = db.sessions ?? [];
  db.history = db.history ?? [];

  const existing = db.users.find((u) => u.email === EMAIL);
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = "admin";
    existing.emailVerified = true;
    existing.name = NAME;
    existing.plan = existing.plan || "business";
    existing.credits = Math.max(existing.credits ?? 0, 9999);
    existing.updatedAt = now;
    return "updated";
  }

  db.users.push({
    id: randomBytes(12).toString("hex"),
    email: EMAIL,
    name: NAME,
    passwordHash,
    plan: "business",
    role: "admin",
    credits: 9999,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
  });
  return "created";
}

async function seedPostgres(url) {
  const sql = neon(normalizeDatabaseUrl(url));
  await sql`
    CREATE TABLE IF NOT EXISTS aiforge_store (
      id integer PRIMARY KEY CHECK (id = 1),
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const rows = await sql`SELECT data FROM aiforge_store WHERE id = 1`;
  let db;
  if (rows.length === 0) {
    db = { users: [], sessions: [], history: [] };
    await sql`
      INSERT INTO aiforge_store (id, data)
      VALUES (1, ${JSON.stringify(db)}::jsonb)
    `;
  } else {
    db = rows[0].data;
  }

  const action = upsertAdmin(db);
  await sql`
    INSERT INTO aiforge_store (id, data, updated_at)
    VALUES (1, ${JSON.stringify(db)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE
    SET data = EXCLUDED.data, updated_at = now()
  `;
  return { action, users: db.users.map((u) => ({ email: u.email, role: u.role })) };
}

function seedFileStore() {
  const dataDir = path.join(process.cwd(), ".data");
  const dbFile = path.join(dataDir, "db.json");
  mkdirSync(dataDir, { recursive: true });

  let db = { users: [], sessions: [], history: [] };
  if (existsSync(dbFile)) {
    db = JSON.parse(readFileSync(dbFile, "utf8"));
  }

  const action = upsertAdmin(db);
  writeFileSync(dbFile, JSON.stringify(db, null, 2), "utf8");
  return { action, users: db.users.map((u) => ({ email: u.email, role: u.role })) };
}

const databaseUrl = process.env.DATABASE_URL?.trim();
const result = databaseUrl ? await seedPostgres(databaseUrl) : seedFileStore();

console.log(JSON.stringify({ store: databaseUrl ? "postgres" : "file", ...result }, null, 2));
