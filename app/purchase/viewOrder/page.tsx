"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listInventory, type InventoryItem } from "@/lib/api/inventory";

type CartEntry = { id: string; qty: number };

interface Item {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface PaymentInfo {
    cardHolder: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
}

interface ShippingInfo {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
}

export default function ViewOrder() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<Item[]>([]);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [tax, setTax] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);

    // Load cart
    useEffect(() => {
        const raw = localStorage.getItem("cart");
        const cart: CartEntry[] = raw ? JSON.parse(raw) : [];

        (async () => {
            try {
                const inv: InventoryItem[] = await listInventory();
                const map = new Map(inv.map((i) => [String(i.id), i]));

                const merged: Item[] = cart
                    .map(({ id, qty }) => {
                        const p = map.get(String(id));
                        if (!p) return null;
                        return {
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            quantity: qty,
                        };
                    })
                    .filter((x): x is Item => x !== null);

                setCartItems(merged);
            } catch (e) {
                console.error("Failed to load inventory:", e);
                setCartItems([]);
            }
        })();

        const savedPayment = localStorage.getItem("paymentInfo");
        if (savedPayment) {
            try {
                setPaymentInfo(JSON.parse(savedPayment));
            } catch {
                console.warn("Bad paymentInfo in storage");
            }
        }

        const savedShipping = localStorage.getItem("shippingInfo");
        if (savedShipping) {
            try {
                setShippingInfo(JSON.parse(savedShipping));
            } catch {
                console.warn("Bad shippingInfo in storage");
            }
        }
    }, []);

    useEffect(() => {
        const subtotalValue = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const taxValue = subtotalValue * 0.08;
        const totalValue = subtotalValue + taxValue;

        setSubtotal(subtotalValue);
        setTax(taxValue);
        setTotalCost(totalValue);
    }, [cartItems]);

    const handleConfirm = () => {
        localStorage.setItem(
            "orderSummary",
            JSON.stringify({
                cartItems,
                paymentInfo,
                shippingInfo,
                subtotal,
                tax,
                totalCost,
            })
        );
        router.push("/purchase/viewConfirmation");
    };

    const handleBack = () => router.push("/purchase/shippingEntry");

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gradient-to-br from-indigo-100 via-white to-blue-100">
            <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md border border-blue-100 scale-95">
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
                    Order Summary
                </h1>

                {/* items */}
                <div className="space-y-2 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Items</h2>
                    {cartItems.length === 0 ? (
                        <p className="text-sm text-gray-500">Your cart is empty.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between text-sm text-gray-700 border-b py-1"
                            >
                <span>
                  {item.name} (x{item.quantity})
                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* payment */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Payment Info</h2>
                    {paymentInfo ? (
                        <p className="text-sm text-gray-700 mt-1">
                            Card Holder: {paymentInfo.cardHolder} <br />
                            Card Number: **** **** **** {paymentInfo.cardNumber.slice(-4)} <br />
                            Expiry: {paymentInfo.expiry}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500">No payment info found.</p>
                    )}
                </div>

                {/* shipping */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Shipping Info</h2>
                    {shippingInfo ? (
                        <p className="text-sm text-gray-700 mt-1">
                            {shippingInfo.name} <br />
                            {shippingInfo.address1}
                            {shippingInfo.address2 && <>, {shippingInfo.address2}</>}
                            <br />
                            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500">No shipping info found.</p>
                    )}
                </div>

                {/* totals */}
                <div className="text-gray-800 font-semibold mb-6 space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Tax (8%):</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base border-t pt-2">
                        <span>Total:</span>
                        <span>${totalCost.toFixed(2)}</span>
                    </div>
                </div>

                {/* buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handleBack}
                        className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={cartItems.length === 0}
                        className="w-1/2 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg text-sm font-medium shadow-md transition-all"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
