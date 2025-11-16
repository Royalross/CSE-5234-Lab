import { pool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const idNum = Number(params.id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const sql = `
    WITH order_base AS (
      SELECT
        co.id,
        co.customer_name,
        co.customer_email,
        co.status,
        co.payment_info_id_fk,
        co.shipping_info_id_fk
      FROM customer_order co
      WHERE co.id = $1
    ),
    pay AS (
      SELECT
        pi.*
      FROM payment_info pi
      JOIN order_base ob ON ob.payment_info_id_fk = pi.id
    ),
    ship AS (
      SELECT
        si.*
      FROM shipping_info si
      JOIN order_base ob ON ob.shipping_info_id_fk = si.id
    ),
    items AS (
      SELECT
        li.id,
        li.item_number,
        li.item_name,
        li.quantity
      FROM customer_order_line_item li
      JOIN order_base ob ON li.customer_order_id_fk = ob.id
      ORDER BY li.id
    )
    SELECT json_build_object(
      'id', ob.id,
      'customerName', ob.customer_name,
      'customerEmail', ob.customer_email,
      'status', ob.status,
      'paymentInfo', (
        SELECT to_jsonb(pay.*) FROM pay
      ),
      'shippingInfo', (
        SELECT to_jsonb(ship.*) FROM ship
      ),
      'lineItems', COALESCE(
        (SELECT json_agg(to_jsonb(items.*)) FROM items),
        '[]'::json
      )
    ) AS order_json
    FROM order_base ob;
  `;

  try {
    const { rows } = await pool.query<{ order_json: any }>(sql, [idNum]);
    if (rows.length === 0 || !rows[0].order_json) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    return new Response(JSON.stringify(rows[0].order_json), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[GET /api/order/:id]", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
