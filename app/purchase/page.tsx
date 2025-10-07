"use client";

import React from "react";
import ProductCard from "@/components/mine/productcard";
import { products, type Product } from "@/lib/dummy_data";

export default function Page() {
    const handleAdd = (product: Product, qty: number) => {
        console.log("Added to cart:", { id: product.id, qty });
    };

    return (
        <main className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ">
                {products.map((p) => (
                    <div key={p.id} className="h-full">
                        <ProductCard product={p} onAdd={handleAdd} />
                    </div>
                ))}
            </div>
        </main>
    );
}
