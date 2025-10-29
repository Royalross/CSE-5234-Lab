"use client";

import React, {useState} from "react";
import Image from "next/image";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {type Product} from "@/lib/dummy_data";

interface ProductCardProps {
    product: Product;
    onAdd?: (p: Product, qty: number) => void;
}

export default function ProductCard({product, onAdd}: ProductCardProps) {
    const [qty, setQty] = useState<number>(1);
    const add = () => onAdd?.(product, qty);

    const imgSrc =
        product.imageSrc && product.imageSrc.trim() !== ""
            ? product.imageSrc
            : "/placeholder.png";
    const imgAlt = product.imageAlt || product.title || "Product image";

    return (
        <Card className="h-full rounded-md flex flex-col">
            <CardHeader className="p-0">
                <div className="w-full h-full rounded">
                    <Image
                        src={imgSrc}
                        alt={imgAlt}
                        width={700}
                        height={300}
                        className="w-[700px] h-[300px] rounded-t-[5px] object-cover"
                    />
                </div>
            </CardHeader>

            <CardContent className="pt-2 flex-1">
                <p className="font-bold">{product.title}</p>
                {product.subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">{product.subtitle}</p>
                )}
                {typeof product.purchasedCount === "number" && (
                    <p className="text-xs text-muted-foreground mt-2">
                        {product.purchasedCount}+ bought in the past month
                    </p>
                )}
                <p className="font-bold mt-3">${product.price.toLocaleString()}</p>
            </CardContent>

            <CardFooter className="gap-2 justify-end">
                <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={99}
                    value={qty}
                    onChange={(e) =>
                        setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))
                    }
                    className="w-20"
                    aria-label="Quantity"
                />
                <Button variant="outline" onClick={add}>
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
