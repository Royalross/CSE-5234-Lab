"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/mine/productcard";
import type { InventoryItem } from "@/lib/api/inventory";
import { listInventory } from "@/lib/api/inventory";

type CartItem = { id: string; qty: number };

export default function Page() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load inventory from the microservice
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

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const handleAdd = (product: InventoryItem, qty: number) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
            }
            return [...prev, { id: product.id, qty }];
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
                    const adapted = { id: p.id, title: p.name, price: p.price, quantity: p.qty };
                    return (
                        <div key={p.id} className="h-full">
                            <ProductCard product={adapted as any} onAdd={(prod: any, q: number) => handleAdd(p, q)} />
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
