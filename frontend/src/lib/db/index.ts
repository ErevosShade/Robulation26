import { neon, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzleServerless, type NeonDatabase } from "drizzle-orm/neon-serverless";

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
let _pool: Pool | null = null;
let _txDb: NeonDatabase | null = null;

export function getDb(): DbClient {
  if (!_db) {
    _db = createDbClient();
  }
  return _db;
}

export function getTxDb(): NeonDatabase {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.trim() === "") {
    throw new Error("DATABASE_URL environment variable is missing");
  }
  if (!_pool || !_txDb) {
    _pool = new Pool({ connectionString: databaseUrl });
    _txDb = drizzleServerless(_pool);
  }
  return _txDb;
}

export type TransactionClient = Parameters<Parameters<NeonDatabase["transaction"]>[0]>[0];

export async function runTransaction<T>(
  callback: (tx: TransactionClient) => Promise<T>
): Promise<T> {
  const txDb = getTxDb();
  return txDb.transaction(callback);
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

