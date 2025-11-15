import { pool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Basic validation helper
function reqStr(v: unknown, name: string) {
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`${name} is required`);
  }
  return v.trim();
}

type PaymentPayload = {
  holderName: string;
  cardNum: string;
  expDate: string;
  cvv: string;
};

export async function POST(req: Request) {
  let body: PaymentPayload;

  // Parse request JSON
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate input fields
  try {
    reqStr(body.holderName, "holderName");
    reqStr(body.cardNum, "cardNum");
    reqStr(body.expDate, "expDate");
    reqStr(body.cvv, "cvv");
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const paymentToken = `pay_${Math.random().toString(36).slice(2, 10)}`;

    // Insert record into payment_info table
    const r = await client.query<{ id: number }>(
      `INSERT INTO payment_info (holder_name, card_num, exp_date, cvv)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [body.holderName, body.cardNum, body.expDate, body.cvv],
    );

    const paymentId = r.rows[0].id;

    // Return token + paymentId
    return Response.json(
      {
        paymentId,
        paymentToken,
        status: "AUTHORIZED",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/payment] failed:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  } finally {
    client.release();
  }
}
