import { pool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function reqStr(v: unknown, name: string) {
  if (typeof v !== 'string' || v.trim() === '') throw new Error(`${name} is required`);
  return v.trim();
}
function posInt(v: unknown, name: string) {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`${name} must be a positive integer`);
  return n;
}

type OrderPayload = {
  customerName: string;
  customerEmail?: string;
  status?: string;
  paymentInfo?: {
    holderName: string;
    cardNum: string;
    expDate: string;
    cvv: string; 
  };
  shippingInfo?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    email?: string;
  };
  items: Array<{ itemNumber: number; itemName: string; quantity: number }>;
};

export async function POST(req: Request) {
  let body: OrderPayload;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    reqStr(body.customerName, 'customerName');
    if (!Array.isArray(body.items) || body.items.length === 0) {
      throw new Error('items must be a non-empty array');
    }
    for (const [i, it] of body.items.entries()) {
      posInt(it.itemNumber, `items[${i}].itemNumber`);
      reqStr(it.itemName, `items[${i}].itemName`);
      posInt(it.quantity, `items[${i}].quantity`);
    }

    if (body.paymentInfo) {
      reqStr(body.paymentInfo.holderName, 'paymentInfo.holderName');
      reqStr(body.paymentInfo.cardNum, 'paymentInfo.cardNum');
      reqStr(body.paymentInfo.expDate, 'paymentInfo.expDate');
      reqStr(body.paymentInfo.cvv, 'paymentInfo.cvv');
    }

    if (body.shippingInfo) {
      reqStr(body.shippingInfo.address1, 'shippingInfo.address1');
      reqStr(body.shippingInfo.city, 'shippingInfo.city');
      reqStr(body.shippingInfo.state, 'shippingInfo.state');
      reqStr(body.shippingInfo.country, 'shippingInfo.country');
      reqStr(body.shippingInfo.postalCode, 'shippingInfo.postalCode');
    }
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    //payment_info -> id
    let paymentId: number | null = null;
    if (body.paymentInfo) {
      const p = body.paymentInfo;
      const r = await client.query<{ id: number }>(
        `INSERT INTO payment_info (holder_name, card_num, exp_date, cvv)
         VALUES ($1,$2,$3,$4)
         RETURNING id`,
        [p.holderName, p.cardNum, p.expDate, p.cvv]
      );
      paymentId = r.rows[0].id;
    }

    //shipping_info -> id
    let shippingId: number | null = null;
    if (body.shippingInfo) {
      const s = body.shippingInfo;
      const r = await client.query<{ id: number }>(
        `INSERT INTO shipping_info (address1, address2, city, state, country, postal_code, email)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING id`,
        [s.address1, s.address2 ?? null, s.city, s.state, s.country, s.postalCode, s.email ?? null]
      );
      shippingId = r.rows[0].id;
    }

    //customer_order -> id
    const orderRes = await client.query<{ id: number }>(
      `INSERT INTO customer_order
       (customer_name, customer_email, shipping_info_id_fk, payment_info_id_fk, status)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id`,
      [
        body.customerName,
        body.customerEmail ?? null,
        shippingId,
        paymentId,
        body.status ?? 'New',
      ]
    );
    const orderId = orderRes.rows[0].id;

    //line items (batch)
    const vals: any[] = [];
    const rows: string[] = [];
    body.items.forEach((it, i) => {
      const base = i * 4;
      rows.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
      vals.push(it.itemNumber, it.itemName, it.quantity, orderId);
    });
    await client.query(
      `INSERT INTO customer_order_line_item (item_number, item_name, quantity, customer_order_id_fk)
       VALUES ${rows.join(',')}`,
      vals
    );

    await client.query('COMMIT');

    return Response.json(
      {
        id: orderId,
        customerName: body.customerName,
        customerEmail: body.customerEmail ?? null,
        status: body.status ?? 'New',
        paymentInfoId: paymentId,
        shippingInfoId: shippingId,
        lineItemsCount: body.items.length,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[POST /api/order] failed:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
