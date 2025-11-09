import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

export const pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // add below if seeing SSL errors
    ssl: { rejectUnauthorized: false },
  });

if (!global._pgPool) global._pgPool = pool;
