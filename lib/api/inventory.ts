// export type InventoryItem = { id: string; name: string; price: number; qty: number };

// const BASE = process.env.NEXT_PUBLIC_API_BASE!;

// export async function listInventory(): Promise<InventoryItem[]> {
//     const res = await fetch(`${BASE}/inventory`, { cache: "no-store" });
//     if (!res.ok) throw new Error(`Inventory fetch failed: ${res.status}`);
//     return res.json();
// }

// export async function getItemById(id: string): Promise<InventoryItem> {
//     const res = await fetch(`${BASE}/inventory/items/${id}`, { cache: "no-store" });
//     if (!res.ok) throw new Error(`Fetch item ${id} failed: ${res.status}`);
//     return res.json();
// }
// lib/api/inventory.ts

export type InventoryItem = {
  id: number;
  itemNumber: number;
  name: string;
  description: string;
  availableQuantity: number;
  unitPrice: number;
};

// acquire local Next.js API，instead of external URL
export async function listInventory(): Promise<InventoryItem[]> {
  const res = await fetch("/api/inventory", { cache: "no-store" });
  if (!res.ok) throw new Error(`Inventory fetch failed: ${res.status}`);
  return res.json();
}

export async function getItemById(id: string): Promise<InventoryItem> {
  const res = await fetch(`/api/inventory/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch item ${id} failed: ${res.status}`);
  return res.json();
}
