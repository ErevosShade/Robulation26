import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

function createDbClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.trim() === "") {
    throw new Error("DATABASE_URL environment variable is missing");
  }

  const client = neon(databaseUrl);
  return drizzle({ client });
}

export type DbClient = ReturnType<typeof createDbClient>;

let _db: DbClient | null = null;

export function getDb(): DbClient {
  if (!_db) {
    _db = createDbClient();
  }
  return _db;
}

export const db: DbClient = new Proxy({} as DbClient, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
