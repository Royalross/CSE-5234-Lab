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
  name: string;
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

  // ---------- cart helpers ----------
  const syncCartToStorage = (items: Item[]) => {
    const cart: CartEntry[] = items.map((i) => ({
      id: i.id,
      qty: i.quantity,
    }));
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id ? { ...item, quantity } : item,
        )
        .filter((item) => item.quantity > 0);

      syncCartToStorage(updated);
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      syncCartToStorage(updated);
      return updated;
    });
  };

  // ---------- delete / change payment & shipping ----------
  const handleDeletePayment = () => {
    localStorage.removeItem("paymentInfo");
    setPaymentInfo(null);
  };

  const handleChangePayment = () => {
    router.push("/purchase/paymentEntry");
  };

  const handleDeleteShipping = () => {
    localStorage.removeItem("shippingInfo");
    setShippingInfo(null);
  };

  const handleChangeShipping = () => {
    router.push("/purchase/shippingEntry");
  };

  // Load cart + saved info
  useEffect(() => {
    const raw = localStorage.getItem("cart");
    const cart: CartEntry[] = raw ? JSON.parse(raw) : [];

    (async () => {
      try {
        const inv: InventoryItem[] = await listInventory();

        const map = new Map(inv.map((i) => [String(i.itemNumber), i]));

        const merged: Item[] = cart
          .map(({ id, qty }) => {
            const p = map.get(String(id));
            if (!p) return null;
            return {
              id: String(p.itemNumber),
              name: p.name,
              price: p.unitPrice,
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

  // compute totals
  useEffect(() => {
    const subtotalValue = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
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
      }),
    );
    // go to confirmation page
    router.push("/purchase/viewConfirmation");
  };

  const handleBack = () => router.push("/products");

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
                className="flex justify-between items-center text-sm text-gray-700 border-b py-2 gap-3"
              >
                {/* Left: Name + Price/Line Total */}
                <div className="flex-1">
                  <div className="font-medium">
                    {item.name}{" "}
                    <span className="text-gray-500 text-xs">
                      (x{item.quantity})
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ${item.price.toFixed(2)} each &nbsp;|&nbsp; Line total: $
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Middle: Quantity Editor */}
                <div className="flex items-center gap-1">
                  <button
                    className="px-2 py-1 border rounded text-xs"
                    onClick={() =>
                      updateItemQuantity(
                        item.id,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    className="w-12 text-center border rounded text-xs"
                    value={item.quantity}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (!Number.isFinite(v) || v <= 0) return;
                      updateItemQuantity(item.id, v);
                    }}
                  />
                  <button
                    className="px-2 py-1 border rounded text-xs"
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                {/* Right: Remove */}
                <button
                  className="text-red-500 text-xs ml-1"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* payment */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Payment Info
            </h2>
            {paymentInfo && (
              <div className="flex gap-3 text-xs">
                <button
                  onClick={handleChangePayment}
                  className="text-blue-600 hover:underline"
                >
                  Change
                </button>
                <button
                  onClick={handleDeletePayment}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {paymentInfo ? (
            <p className="text-sm text-gray-700 mt-1">
              Card Holder: {paymentInfo.name} <br />
              Card Number: **** **** ****{" "}
              {paymentInfo.cardNumber.slice(-3)} <br />
              Expiry: {paymentInfo.expiry}
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                No payment info found.
              </p>
              <button
                onClick={() => router.push("/purchase/paymentEntry")}
                className="mt-2 text-blue-600 text-sm underline hover:text-blue-800"
              >
                Add Payment Info
              </button>
            </>
          )}
        </div>

        {/* shipping */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Shipping Info
            </h2>
            {shippingInfo && (
              <div className="flex gap-3 text-xs">
                <button
                  onClick={handleChangeShipping}
                  className="text-blue-600 hover:underline"
                >
                  Change
                </button>
                <button
                  onClick={handleDeleteShipping}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {shippingInfo ? (
            <p className="text-sm text-gray-700 mt-1">
              {shippingInfo.name} <br />
              {shippingInfo.address1}
              {shippingInfo.address2 && <>, {shippingInfo.address2}</>}
              <br />
              {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                No shipping info found.
              </p>
              <button
                onClick={() => router.push("/purchase/shippingEntry")}
                className="mt-2 text-blue-600 text-sm underline hover:text-blue-800"
              >
                Add Shipping Info
              </button>
            </>
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
    disabled={
      cartItems.length === 0 ||
      !paymentInfo ||
      !shippingInfo
    }
    className={
      "w-1/2 py-2 rounded-lg text-sm font-medium shadow-md transition-all " +
      (
        cartItems.length === 0 ||
        !paymentInfo ||
        !shippingInfo
          ? "opacity-60 cursor-not-allowed bg-gray-300"
          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      )
    }
  >
    Confirm
  </button>
</div>

      </div>
    </div>
  );
}
