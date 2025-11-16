import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const TABLE_NAME = process.env.SHIPPING_TABLE || "ShippingTable";

export const handler = async (event) => {
  console.log("Shipping Lambda invoked with SNS event:", JSON.stringify(event));

  for (const record of event.Records) {
    const snsMsg = JSON.parse(record.Sns.Message); // EventBridge event
    const detail = snsMsg.detail;

    console.log("Decoded order detail:", JSON.stringify(detail));

    const item = {
      orderId:        { N: String(detail.orderId) },
      businessId:     { S: detail.businessId },
      paymentToken:   { S: detail.paymentToken },
      packetCount:    { N: String(detail.packetCount) },
      weightPerPacket:{ N: String(detail.weightPerPacket) },
      createdAt:      { S: new Date().toISOString() }
    };

    await ddb.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: item
      })
    );
  }

  return { statusCode: 200 };
};
