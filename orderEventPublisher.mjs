import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { Pool } from "pg";

const eventBridge = new EventBridgeClient({ region: process.env.AWS_REGION || "us-east-1" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // RDS/Postgres connection string
  ssl: { rejectUnauthorized: false }         
});

// For lab write-up, this is your “storefront registration id”
const BUSINESS_ID = "STORE-001";

export const handler = async (event) => {
  // Order JSON is sent from API Gateway -> Lambda as body
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  const client = await pool.connect();

  try {
    // Persist order + items in Order DB
    await client.query("BEGIN");

    // paymentToken comes from Payment service
    const paymentToken = body.paymentToken;

    const orderRes = await client.query(
      `INSERT INTO customer_order (customer_name, customer_email, status, payment_token)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [body.customerName, body.customerEmail, "New", paymentToken]
    );
    const orderId = orderRes.rows[0].id;

    for (const item of body.items) {
      await client.query(
        `INSERT INTO customer_order_line_item (item_number, item_name, quantity, customer_order_id_fk)
         VALUES ($1,$2,$3,$4)`,
        [item.itemNumber, item.itemName, item.quantity, orderId]
      );
    }

    await client.query("COMMIT");

    // Compute async shipping info
    const packetCount = body.items.length;
    const weightPerPacket =
      body.items[0] && body.items[0].quantity
        ? body.items[0].quantity * 1.0
        : 0;

    // This is the EventBridge "detail" object for Shipping
    const detail = {
      orderId,
      paymentToken,
      businessId: BUSINESS_ID,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      packetCount,
      weightPerPacket,
      shippingAddress: body.shippingInfo,
      items: body.items
    };

    // Publish event to EventBridge
    const putResult = await eventBridge.send(
      new PutEventsCommand({
        Entries: [
          {
            Source: "order.service",            // used in Event pattern
            DetailType: "OrderCreated",        // used in Event pattern
            Detail: JSON.stringify(detail),
            EventBusName: "default"
          }
        ]
      })
    );

    console.log("EventBridge putEvents result:", JSON.stringify(putResult));

    return {
      statusCode: 201,
      body: JSON.stringify({ orderId, paymentToken, eventResult: putResult })
    };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[OrderEventPublisher] error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  } finally {
    client.release();
  }
};
