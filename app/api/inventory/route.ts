export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id,
              item_number AS "itemNumber",
              name,
              description,
              available_quantity AS "availableQuantity",
              unit_price AS "unitPrice"
       FROM item
       ORDER BY id ASC;`,
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("GET /api/inventory error:", err);
    return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });
  }
}
