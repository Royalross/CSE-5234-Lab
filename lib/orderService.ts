import { pool } from "@/lib/db";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import type { OrderItem, OrderPayload } from "./orderTypes";

export class OrderError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const eventBridge = new EventBridgeClient({
  region: process.env.AWS_REGION ?? "us-east-1",
});

function reqStr(v: unknown, name: string) {
  if (typeof v !== "string" || v.trim() === "") {
    throw new OrderError(`${name} is required`, 400);
  }
  return v.trim();
}

function posInt(v: unknown, name: string) {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) {
    throw new OrderError(`${name} must be a positive integer`, 400);
  }
  return n;
}

function validatePayload(body: OrderPayload) {
  reqStr(body.customerName, "customerName");

  // items: only trust itemNumber + quantity
  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new OrderError("items must be a non-empty array", 400);
  }
  body.items.forEach((it, i) => {
    posInt(it.itemNumber, `items[${i}].itemNumber`);
    posInt(it.quantity, `items[${i}].quantity`);
  });

  // payment
  if (!body.paymentInfo) {
    throw new OrderError("paymentInfo is required", 400);
  }
  reqStr(body.paymentInfo.holderName, "paymentInfo.holderName");
  reqStr(body.paymentInfo.cardNum, "paymentInfo.cardNum");
  reqStr(body.paymentInfo.expDate, "paymentInfo.expDate");
  reqStr(body.paymentInfo.cvv, "paymentInfo.cvv");

  // shipping
  if (!body.shippingInfo) {
    throw new OrderError("shippingInfo is required", 400);
  }
  reqStr(body.shippingInfo.address1, "shippingInfo.address1");
  reqStr(body.shippingInfo.city, "shippingInfo.city");
  reqStr(body.shippingInfo.state, "shippingInfo.state");
  reqStr(body.shippingInfo.country, "shippingInfo.country");
  reqStr(body.shippingInfo.postalCode, "shippingInfo.postalCode");
}

type EnrichedItem = OrderItem & {
  itemName: string;
  unitPrice: number;
  availableQuantity: number;
};

type InventoryServiceItem = {
  itemNumber: number;
  name: string;
  description?: string;
  availableQuantity: number;
  unitPrice: number;
};

// Call Inventory service to validate quantity + pricing
async function loadAndValidateItemsFromInventory(
  items: OrderItem[],
): Promise<EnrichedItem[]> {
  const baseUrl = process.env.INVENTORY_SERVICE_URL;
  if (!baseUrl) {
    throw new OrderError("INVENTORY_SERVICE_URL not configured", 500);
  }
  // Call inventory API (GET /api/inventory)
  const res = await fetch(`${baseUrl}/api/inventory`);
  if (!res.ok) {
    const text = await res.text();
    throw new OrderError(`Inventory service error: ${text}`, 500);
  }
  const inventory = (await res.json()) as InventoryServiceItem[];

  // Build lookup table by itemNumber
  const byNumber = new Map<number, InventoryServiceItem>();
  for (const inv of inventory) {
    byNumber.set(inv.itemNumber, inv);
  }
  const enriched: EnrichedItem[] = [];

  for (const req of items) {
    const inv = byNumber.get(req.itemNumber);
    if (!inv) {
      throw new OrderError(
        `Item ${req.itemNumber} not found in inventory service`,
        400,
      );
    }

    if (inv.availableQuantity < req.quantity) {
      throw new OrderError(
        `Not enough stock for item ${inv.name} (have ${inv.availableQuantity}, need ${req.quantity})`,
        400,
      );
    }

    enriched.push({
      ...req,
      itemName: inv.name,
      unitPrice: inv.unitPrice,
      availableQuantity: inv.availableQuantity,
    });
  }

  return enriched;
}

// Payment service (sync)

async function callPayment(
  amount: number,
  body: OrderPayload,
): Promise<{ paymentToken: string }> {
  const url = process.env.PAYMENT_SERVICE_URL;
  if (!url) {
    throw new OrderError("PAYMENT_SERVICE_URL not configured", 500);
  }

  const p = body.paymentInfo;
  const res = await fetch(`${url}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      holderName: p.holderName,
      cardNum: p.cardNum,
      expDate: p.expDate,
      cvv: p.cvv,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new OrderError(`Payment failed: ${text}`, 402);
  }

  const data = await res.json();
  if (!data.paymentToken) {
    throw new OrderError("Payment service did not return paymentToken", 500);
  }
  return { paymentToken: data.paymentToken };
}

// Save order in DB
async function saveOrderToDb(
  body: OrderPayload,
  paymentToken: string,
  totalAmount: number,
  items: EnrichedItem[],
): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // payment_info: only holder_name + payment_token
    const p = body.paymentInfo;
    const payRes = await client.query<{ id: number }>(
      `INSERT INTO payment_info (holder_name, payment_token)
       VALUES ($1,$2)
         RETURNING id`,
      [p.holderName, paymentToken],
    );
    const paymentId = payRes.rows[0].id;

    // shipping_info
    const s = body.shippingInfo;
    const shipRes = await client.query<{ id: number }>(
      `INSERT INTO shipping_info (address1, address2, city, state, country, postal_code, email)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING id`,
      [
        s.address1,
        s.address2 ?? null,
        s.city,
        s.state,
        s.country,
        s.postalCode,
        s.email ?? null,
      ],
    );
    const shippingId = shipRes.rows[0].id;

    // customer_order with payment_token
    const orderRes = await client.query<{ id: number }>(
      `INSERT INTO customer_order
       (customer_name, customer_email, shipping_info_id_fk, payment_info_id_fk, status, payment_token)
       VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING id`,
      [
        body.customerName,
        body.customerEmail ?? null,
        shippingId,
        paymentId,
        body.status ?? "Paid",
        paymentToken,
      ],
    );
    const orderId = orderRes.rows[0].id;

    // line items
    const vals: any[] = [];
    const rows: string[] = [];
    items.forEach((it, i) => {
      const base = i * 4;
      rows.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
      vals.push(it.itemNumber, it.itemName, it.quantity, orderId);
    });

    await client.query(
      `INSERT INTO customer_order_line_item (item_number, item_name, quantity, customer_order_id_fk)
       VALUES ${rows.join(",")}`,
      vals,
    );

    await client.query("COMMIT");
    return orderId;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[saveOrderToDb]", err);
    throw new OrderError("Failed to save order", 500);
  } finally {
    client.release();
  }
}

// EventBridge shipping event
async function sendShippingEvent(orderId: number, body: OrderPayload) {
  const FIXED_WEIGHT = 1; // per item
  const packets = body.items.map((it) => ({
    itemNumber: it.itemNumber,
    packetWeight: it.quantity * FIXED_WEIGHT,
  }));
  const detail = {
    businessId: process.env.BUSINESS_ID ?? "demo-store",
    orderId,
    shipmentAddress: body.shippingInfo.address1,
    packetCount: packets.length,
    packets,
  };

  const busName = process.env.EVENT_BUS_NAME;
  if (!busName) {
    console.warn("EVENT_BUS_NAME not set, skipping EventBridge send");
    return detail;
  }

  try {
    await eventBridge.send(
      new PutEventsCommand({
        Entries: [
          {
            Source: "order-service",
            DetailType: "OrderCreated",
            Detail: JSON.stringify(detail),
            EventBusName: busName,
          },
        ],
      }),
    );
  } catch (err) {
    console.error("[sendShippingEvent] EventBridge error", err);
  }
  return detail;
}

export async function createOrder(body: OrderPayload) {
  validatePayload(body);

  // Inventory, the inventory API
  const enrichedItems = await loadAndValidateItemsFromInventory(body.items);

  // total from unit_price in inventory
  const totalAmount = enrichedItems.reduce(
    (sum, it) => sum + it.quantity * it.unitPrice,
    0,
  );

  // payment (sync)
  const { paymentToken } = await callPayment(totalAmount, body);

  // persist in DB
  const orderId = await saveOrderToDb(
    body,
    paymentToken,
    totalAmount,
    enrichedItems,
  );

  // async shipping event
  const shippingDetail = await sendShippingEvent(orderId, body);

  return {
    orderId,
    totalAmount,
    paymentToken,
    shippingDetail,
  };
}
