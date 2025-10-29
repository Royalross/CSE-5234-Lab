export type InventoryItem = { id: string; name: string; price: number; qty: number };

const BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function listInventory(): Promise<InventoryItem[]> {
    const res = await fetch(`${BASE}/inventory`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Inventory fetch failed: ${res.status}`);
    return res.json();
}

export async function getItemById(id: string): Promise<InventoryItem> {
    const res = await fetch(`${BASE}/inventory/items/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch item ${id} failed: ${res.status}`);
    return res.json();
}
