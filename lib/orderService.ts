import { pool } from "@/lib/db";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import type { OrderItem, OrderPayload, OrderResult } from "./orderTypes";

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

// Payment service (sync) - Removed unused callPayment

// Save order in DB
async function saveOrderToDb(
  body: OrderPayload,
  paymentToken: string,
  totalAmount: number,
  items: EnrichedItem[],
): Promise<{ orderId: number; paymentInfoId: number; shippingInfoId: number }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) payment_info
    const p = body.paymentInfo;
    const payRes = await client.query<{ id: number }>(
      `INSERT INTO payment_info (holder_name, card_num, exp_date, cvv, payment_token)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id`,
      [p.holderName, p.cardNum, p.expDate, p.cvv, paymentToken],
    );
    const paymentInfoId = payRes.rows[0].id;

    // 2) shipping_info
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
    const shippingInfoId = shipRes.rows[0].id;

    // 3) customer_order
    const orderRes = await client.query<{ id: number }>(
      `INSERT INTO customer_order
       (customer_name, customer_email, shipping_info_id_fk, payment_info_id_fk, status, payment_token)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [
        body.customerName,
        body.customerEmail ?? null,
        shippingInfoId,
        paymentInfoId,
        body.status ?? "Paid",
        paymentToken,
      ],
    );
    const orderId = orderRes.rows[0].id;

    // 4) line items
    const vals: (string | number)[] = [];
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

    // 5) 扣库存：item 表
    for (const it of items) {
      await client.query(
        `UPDATE item
         SET available_quantity = available_quantity - $1
         WHERE item_number = $2`,
        [it.quantity, it.itemNumber],
      );
    }

    await client.query("COMMIT");
    return { orderId, paymentInfoId, shippingInfoId };
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

export async function createOrder(body: OrderPayload): Promise<OrderResult> {
  // 1. unchanged validate payload
  validatePayload(body);

  // 2. Load prices and inventory from inventory service, and validate quantities (reuse your previous logic)
  const enrichedItems = await loadAndValidateItemsFromInventory(body.items);

  // 3. Calculate total amount using unit price * quantity
  const totalAmount = enrichedItems.reduce(
    (sum, it) => sum + it.quantity * it.unitPrice,
    0,
  );

  // 4. No longer actually call payment microservice, generate a fake paymentToken
  const paymentToken = `FAKE-${Date.now().toString(36)}`;

  // 5. Write order + paymentInfo + shippingInfo + line items to RDS, and deduct inventory there
  const { orderId, paymentInfoId, shippingInfoId } = await saveOrderToDb(
    body,
    paymentToken,
    totalAmount,
    enrichedItems,
  );

  // 6. Send shipping event (if EVENT_BUS_NAME is not set, it will be skipped)
  const shippingDetail = await sendShippingEvent(orderId, body);

  // 7. Return result to /api/order
  return {
    id: orderId,
    orderId,
    customerName: body.customerName,
    customerEmail: body.customerEmail ?? null,
    status: body.status ?? "Paid",
    paymentInfoId,
    shippingInfoId,
    lineItemsCount: body.items.length,
    totalAmount,
    paymentToken,
    shippingDetail,
  };
}
