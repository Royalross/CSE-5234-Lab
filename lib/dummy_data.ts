"use client";

export type Product = {
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    imageSrc?: string | null;
    imageAlt?: string | null;
    purchasedCount?: number;
};

export const products: Product[] = [
    {
        id: "p1",
        title: "Once-in-a-lifetime Blue Dragon",
        subtitle: "Breathes fire. Trains you to be the Dragon Warrior.",
        price: 20000,
        imageSrc: "/MainBefore.jpg",
        imageAlt: "Epic blue dragon",
        purchasedCount: 200,
    },
    {
        id: "p2",
        title: "Mini Phoenix (Starter Kit)",
        subtitle: "Self-rekindling. Includes care guide.",
        price: 399,
        imageSrc: "/The-Phoenix.jpg",
        imageAlt: "Mini phoenix",
        purchasedCount: 87,
    },
    {
        id: "p3",
        title: "Invisibility Cloak v2",
        subtitle: "Lightweight. Pocket-safe.",
        price: 1299,
        imageSrc: "/the-invisibility-cloak.png",
        imageAlt: "Invisibility cloak",
        purchasedCount: 520,
    },
];
