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

  const imageMap: Record<string, string> = {
    'Laptop 15"': "/laptop.jpg",
    "Wireless Mouse": "/wireless_mouse.jpg",
    Keyboard: "/keyboard.jpg",
    'Monitor 27"': "/Monitor27.jpg",
    "USB-C Hub": "/USB_C_Hub.jpg",
    "Smartphone Pro": "/Smartphone_Pro.jpg",
    "4TB External Hard Drive": "/4TB_External_Hard_Drive.jpg",
    "Noise Cancelling Headphones": "/Noise_Cancelling_Headphones.jpg",
    "Bluetooth Speaker": "/Bluetooth_Speaker.jpg",
    "Gaming Mouse": "/Gaming_Mouse.jpg",
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await listInventory();
        console.log("Fetched inventory items:", data);
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  const handleAdd = (product: InventoryItem, qty: number) => {
    const id = product.itemNumber.toString();

    let updated: CartItem[];
    let totalQty = qty;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);

      if (existing) {
        totalQty = existing.qty + qty;
        updated = prev.map((i) =>
          i.id === id ? { ...i, qty: totalQty } : i
        );
      } else {
        updated = [...prev, { id, qty }];
      }

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    return totalQty;
  };

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f29] via-[#111a3a] to-[#1a2550]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-300 text-sm tracking-wide animate-pulse">
            Loading products…
          </p>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen px-6 py-10 pt-28 bg-gradient-to-b from-[#0a0f2c] via-[#0f163e] to-[#131a45] text-white">

      {/* ---- Page Header ---- */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 drop-shadow-lg">
          NovaTech Product Catalog
        </h1>

        <p className="mt-3 text-gray-300 max-w-xl mx-auto text-sm">
          Explore high-performance tech essentials across our curated collection.
        </p>

        <div className="mt-4 inline-block px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-cyan-200 shadow-md">
          🛒 Cart: {cart.reduce((sum, i) => sum + i.qty, 0)} items
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => {

          const adapted: Product = {
            id: p.itemNumber.toString(),
            title: p.name,
            subtitle: p.description,
            price: p.unitPrice,
            imageSrc: imageMap[p.name] || "/placeholder.png",
            imageAlt: p.name,
          };

          return (
            <div
              key={p.itemNumber}
              className="h-full bg-white rounded-2xl shadow-xl p-5 hover:shadow-2xl hover:-translate-y-1 transition border border-gray-100"
            >
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
