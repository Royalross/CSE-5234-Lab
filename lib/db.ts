import { Pool } from "pg";

console.log("DATABASE_URL is", process.env.DATABASE_URL);

declare global {

  var _pgPool: Pool | undefined;
}

export const pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

if (!global._pgPool) global._pgPool = pool;
