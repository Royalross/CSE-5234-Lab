
import { NextResponse } from "next/server";

const DUMMY_ITEMS = [
  {
    id: 10001,
    itemNumber: 10001,
    name: 'Laptop 15"',
    description: "High performance laptop",
    availableQuantity: 50,
    unitPrice: 999.99,
  },
  {
    id: 10002,
    itemNumber: 10002,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse",
    availableQuantity: 100,
    unitPrice: 29.99,
  },
  {
    id: 10003,
    itemNumber: 10003,
    name: "Keyboard",
    description: "Mechanical keyboard",
    availableQuantity: 75,
    unitPrice: 89.99,
  },
  {
    id: 10004,
    itemNumber: 10004,
    name: 'Monitor 27"',
    description: "4K Ultra HD Monitor",
    availableQuantity: 30,
    unitPrice: 349.99,
  },
  {
    id: 10005,
    itemNumber: 10005,
    name: "USB-C Hub",
    description: "7-in-1 USB-C Hub",
    availableQuantity: 200,
    unitPrice: 49.99,
  },
];

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let apiItems: any[] = [];
  try {
    const res = await fetch(
      "https://0izebsh29i.execute-api.us-east-1.amazonaws.com/dev/inventory-management/inventory/items",
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      apiItems = data.map((row: any) => ({
        id: row.itemNumber, // Use itemNumber as id to match previous logic
        itemNumber: row.itemNumber,
        name: row.name,
        description: row.description,
        availableQuantity: row.availableQuantity,
        unitPrice: Number(row.unitPrice),
      }));
    } else {
      console.error("Failed to fetch from API Gateway:", res.status);
    }
  } catch (err) {
    console.error("Failed to fetch inventory from API Gateway:", err);
    // Continue with dummy items even if API fails
  }

  const combinedItems = [...apiItems, ...DUMMY_ITEMS];
  return NextResponse.json(combinedItems);
}
