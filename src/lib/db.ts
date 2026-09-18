import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "game.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS gem_accounts (
    user_id TEXT PRIMARY KEY,
    balance INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS processed_stripe_sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    gems INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS claimed_milestones (
    user_id TEXT NOT NULL,
    milestone_id TEXT NOT NULL,
    PRIMARY KEY (user_id, milestone_id)
  );
`);

export function getBalance(userId: string): number {
  const row = db.prepare("SELECT balance FROM gem_accounts WHERE user_id = ?").get(userId) as
    | { balance: number }
    | undefined;
  return row?.balance ?? 0;
}

function ensureAccount(userId: string) {
  db.prepare("INSERT OR IGNORE INTO gem_accounts (user_id, balance) VALUES (?, 0)").run(userId);
}

export function creditGems(userId: string, amount: number): number {
  ensureAccount(userId);
  db.prepare("UPDATE gem_accounts SET balance = balance + ? WHERE user_id = ?").run(amount, userId);
  return getBalance(userId);
}

// Returns null if the balance is insufficient (no change made).
export function debitGems(userId: string, amount: number): number | null {
  ensureAccount(userId);
  const current = getBalance(userId);
  if (current < amount) return null;
  db.prepare("UPDATE gem_accounts SET balance = balance - ? WHERE user_id = ?").run(amount, userId);
  return getBalance(userId);
}

export function isSessionProcessed(sessionId: string): boolean {
  return !!db.prepare("SELECT 1 FROM processed_stripe_sessions WHERE session_id = ?").get(sessionId);
}

export function markSessionProcessed(sessionId: string, userId: string, gems: number) {
  db.prepare(
    "INSERT OR IGNORE INTO processed_stripe_sessions (session_id, user_id, gems) VALUES (?, ?, ?)"
  ).run(sessionId, userId, gems);
}

export function hasClaimedMilestone(userId: string, milestoneId: string): boolean {
  return !!db
    .prepare("SELECT 1 FROM claimed_milestones WHERE user_id = ? AND milestone_id = ?")
    .get(userId, milestoneId);
}

export function claimMilestone(userId: string, milestoneId: string) {
  db.prepare("INSERT OR IGNORE INTO claimed_milestones (user_id, milestone_id) VALUES (?, ?)").run(
    userId,
    milestoneId
  );
}

export default db;
