"use client";
import type { OrderPayload } from "@/lib/orderTypes";
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
        .map((item) => (item.id === id ? { ...item, quantity } : item))
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

  const handleDeletePayment = () => {
    localStorage.removeItem("paymentInfo");
    setPaymentInfo(null);
  };

  const handleChangePayment = () => router.push("/purchase/paymentEntry");

  const handleDeleteShipping = () => {
    localStorage.removeItem("shippingInfo");
    setShippingInfo(null);
  };

  const handleChangeShipping = () => router.push("/purchase/shippingEntry");

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
      } catch {
        setCartItems([]);
      }
    })();

    const savedPayment = localStorage.getItem("paymentInfo");
    if (savedPayment) {
      try {
        setPaymentInfo(JSON.parse(savedPayment));
      } catch {}
    }

    const savedShipping = localStorage.getItem("shippingInfo");
    if (savedShipping) {
      try {
        setShippingInfo(JSON.parse(savedShipping));
      } catch {}
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

  const handleConfirm = async () => {
    if (!paymentInfo || !shippingInfo || cartItems.length === 0) return;

    const payload: OrderPayload = {
      customerName: shippingInfo.name || paymentInfo.name || "Guest",
      customerEmail: undefined,
      status: "NEW",
      paymentInfo: {
        holderName: paymentInfo.name,
        cardNum: paymentInfo.cardNumber,
        expDate: paymentInfo.expiry,
        cvv: paymentInfo.cvv,
      },
      shippingInfo: {
        address1: shippingInfo.address1,
        address2: shippingInfo.address2,
        city: shippingInfo.city,
        state: shippingInfo.state,
        country: "US",
        postalCode: shippingInfo.zip,
        email: undefined,
      },
      items: cartItems.map((item) => ({
        itemNumber: Number(item.id),
        quantity: item.quantity,
        itemName: item.name,
      })),
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to place order.");
        return;
      }

      localStorage.setItem(
        "orderSummary",
        JSON.stringify({
          cartItems,
          paymentInfo,
          shippingInfo,
          subtotal,
          tax,
          totalCost,
          orderId: data.orderId,
        })
      );

      localStorage.removeItem("cart");
      router.push("/purchase/viewConfirmation");
    } catch (e) {
      alert("Server error.");
    }
  };

  const handleBack = () => router.push("/products");

  // --------------------------------------------------------------------------
  //                               UI STARTS HERE
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f2c] via-[#10173a] to-[#18224d] p-6 text-white">
      <div className="
        w-full max-w-lg rounded-3xl p-8 
        bg-white/10 backdrop-blur-xl 
        border border-white/20 
        shadow-[0_0_40px_rgba(0,150,255,0.25)]
      ">
        <h1 className="text-3xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300 drop-shadow-lg">
          Order Summary
        </h1>

        {/* ITEMS */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-cyan-200">Items</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-300 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="
                    p-4 rounded-xl 
                    bg-white/5 border border-white/10 
                    shadow-inner backdrop-blur-sm
                    flex items-center justify-between
                  "
                >
                  <div>
                    <p className="font-semibold text-white">
                      {item.name} <span className="text-gray-400 text-xs">(x{item.quantity})</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      ${item.price.toFixed(2)} each — Line: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateItemQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-1 rounded bg-white/10 text-sm hover:bg-white/20"
                    >
                      –
                    </button>

                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      className="w-12 bg-white/10 text-center text-sm rounded border border-white/20"
                      onChange={(e) =>
                        updateItemQuantity(item.id, Math.max(1, Number(e.target.value)))
                      }
                    />

                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 rounded bg-white/10 text-sm hover:bg-white/20"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 text-xs hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PAYMENT INFO */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-purple-200">
              Payment Info
            </h2>

            {paymentInfo && (
              <div className="flex gap-4 text-xs">
                <button onClick={handleChangePayment} className="text-cyan-300 hover:underline">
                  Change
                </button>
                <button onClick={handleDeletePayment} className="text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            )}
          </div>

          {paymentInfo ? (
            <div className="text-gray-200 text-sm">
              <p>Holder: {paymentInfo.name}</p>
              <p>Card: **** **** **** {paymentInfo.cardNumber.slice(-3)}</p>
              <p>Expiry: {paymentInfo.expiry}</p>
            </div>
          ) : (
            <button
              onClick={() => router.push("/purchase/paymentEntry")}
              className="text-cyan-300 text-sm underline"
            >
              Add Payment Info
            </button>
          )}
        </section>

        {/* SHIPPING */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-cyan-200">
              Shipping Info
            </h2>

            {shippingInfo && (
              <div className="flex gap-4 text-xs">
                <button onClick={handleChangeShipping} className="text-cyan-300 hover:underline">
                  Change
                </button>
                <button onClick={handleDeleteShipping} className="text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            )}
          </div>

          {shippingInfo ? (
            <div className="text-gray-200 text-sm">
              <p>{shippingInfo.name}</p>
              <p>{shippingInfo.address1}</p>
              {shippingInfo.address2 && <p>{shippingInfo.address2}</p>}
              <p>
                {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
              </p>
            </div>
          ) : (
            <button
              onClick={() => router.push("/purchase/shippingEntry")}
              className="text-cyan-300 text-sm underline"
            >
              Add Shipping Info
            </button>
          )}
        </section>

        {/* TOTALS */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-purple-200 mb-3">
            Total
          </h2>

          <div className="space-y-1 text-gray-200 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-bold text-cyan-300">
              <span>Total:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleBack}
            className="
              w-1/2 py-2 rounded-lg 
              bg-white/10 hover:bg-white/20 
              text-white shadow-md transition-all
            "
          >
            Back
          </button>

          <button
            onClick={handleConfirm}
            disabled={cartItems.length === 0 || !paymentInfo || !shippingInfo}
            className={`
              w-1/2 py-2 rounded-lg text-white font-semibold transition-all
              ${
                cartItems.length === 0 || !paymentInfo || !shippingInfo
                  ? "opacity-50 cursor-not-allowed bg-gray-500"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl"
              }
            `}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
