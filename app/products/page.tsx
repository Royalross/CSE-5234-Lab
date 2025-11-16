"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/mine/productcard";
import type { Product } from "@/lib/dummy_data";
import type { InventoryItem } from "@/lib/api/inventory";
import { listInventory } from "@/lib/api/inventory";

type CartItem = { id: string; qty: number };

export default function Page() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load inventory from local Next.js API (which hits the DB)
  useEffect(() => {
    (async () => {
      try {
        const data = await listInventory();
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load cart from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        console.error("Bad cart data in storage");
      }
    }
  }, []);

  // Persist cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAdd = (product: InventoryItem, qty: number) => {
    const id = product.itemNumber.toString(); // use itemNumber as the stable ID
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { id, qty }];
    });
  };

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <main className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          Cart ({cart.reduce((sum, i) => sum + i.qty, 0)} items)
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {items.map((p) => {
          // Adapt InventoryItem (DB) -> Product (UI)
          const adapted: Product = {
            id: p.itemNumber.toString(),
            title: p.name,
            subtitle: p.description,
            price: p.unitPrice,
            imageSrc: "/placeholder.png",
            imageAlt: p.name,
          };

          return (
            <div key={p.itemNumber} className="h-full">
              <ProductCard
                product={adapted}
                onAdd={(_prod, q) => handleAdd(p, q)}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}
