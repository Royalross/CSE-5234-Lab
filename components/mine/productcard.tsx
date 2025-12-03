"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Product } from "@/lib/dummy_data";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onAdd?: (p: Product, qty: number) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const [qty, setQty] = useState<number>(1);

  const imgSrc =
    typeof product.imageSrc === "string" && product.imageSrc.trim() !== ""
      ? product.imageSrc
      : "/placeholder.png";

  const handleAdd = () => {
    onAdd?.(product, qty);

    toast.success(
      `${product.title} added to cart (${qty} item${qty > 1 ? "s" : ""})`
    );

    setQty(1);
  };

  return (
    <Card
      className="
        h-full flex flex-col rounded-2xl overflow-hidden
        bg-[#11172e]/60 backdrop-blur-xl 
        border border-white/10
        shadow-[0_0_20px_rgba(0,0,0,0.6)]
        hover:shadow-[0_0_35px_rgba(0,200,255,0.25)]
        hover:-translate-y-1 transition-all duration-300
        text-white
      "
    >
      <CardHeader className="p-0">
        <div className="w-full h-[300px] overflow-hidden">
          <Image
            src={imgSrc}
            alt={product.title}
            width={800}
            height={300}
            unoptimized
            className="
              w-full h-full object-cover 
              transition-transform duration-300 hover:scale-105
            "
          />
        </div>
      </CardHeader>

      <CardContent className="pt-4 px-4 flex-1">
        <p className="font-bold text-lg">{product.title}</p>

        {product.subtitle && (
          <p className="text-sm text-gray-300 mt-1">{product.subtitle}</p>
        )}

        <p className="text-cyan-300 font-bold text-xl mt-4">
          ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </CardContent>

      <CardFooter className="px-4 pb-4 gap-3 justify-end">
        <Input
          type="number"
          min={1}
          max={99}
          value={qty}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!isNaN(n)) setQty(Math.max(1, Math.min(99, n)));
          }}
          className="
            w-20 text-white bg-white/10 border border-white/20
            focus-visible:ring-cyan-400
          "
        />

        <Button
          onClick={handleAdd}
          className="
            bg-gradient-to-r from-cyan-500 to-blue-500
            hover:from-cyan-400 hover:to-blue-400
            text-white font-semibold px-4 py-2 rounded-lg
            shadow-md hover:shadow-xl transition-all
          "
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
