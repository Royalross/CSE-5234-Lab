"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

function ViewConfirmationContent() {
  const router = useRouter();
  const search = useSearchParams();

  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [confirmationNumber, setConfirmationNumber] = useState<string>("");

  useEffect(() => {
    const orderSummaryRaw = localStorage.getItem("orderSummary");
    const queryConf = search.get("conf");

    if (orderSummaryRaw) {
      try {
        const data = JSON.parse(orderSummaryRaw);
        setCartItems(data.cartItems || []);
        setPaymentInfo(data.paymentInfo || null);
        setShippingInfo(data.shippingInfo || null);
        setSubtotal(data.subtotal || 0);
        setTax(data.tax || 0);
        setTotalCost(data.totalCost || 0);

        const conf =
          queryConf ||
          data.confirmation ||
          `ORD-${Math.floor(Math.random() * 900000 + 100000)}`;
        setConfirmationNumber(conf);
      } catch {
        setConfirmationNumber(
          queryConf || `ORD-${Math.floor(Math.random() * 900000 + 100000)}`
        );
      }
    } else {
      setConfirmationNumber(
        queryConf || `ORD-${Math.floor(Math.random() * 900000 + 100000)}`
      );
    }
  }, [search]);

  const handleReturnHome = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("orderSummary");
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gradient-to-br from-[#0a0f24] via-[#11172e] to-[#1a2240]">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20 scale-[0.98] text-white">
        <h1 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Order Confirmed
        </h1>

        <p className="text-center text-gray-300 mb-6">
          Thank you for your purchase!
        </p>

        <div className="text-center mb-8">
          <span className="font-semibold text-gray-300">Confirmation Code</span>
          <div className="text-2xl font-mono text-cyan-300 mt-1 tracking-wide">
            {confirmationNumber}
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              Order Summary
            </h2>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-gray-300 border-b border-white/10 py-2"
              >
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span className="text-cyan-300">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {paymentInfo && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-cyan-300">
              Payment Info
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Card Holder: {paymentInfo.cardHolder} <br />
              Card Number: **** **** **** {paymentInfo.cardNumber.slice(-4)}{" "}
              <br />
              Expiry: {paymentInfo.expiry}
            </p>
          </div>
        )}

        {shippingInfo && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-cyan-300">
              Shipping Info
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              {shippingInfo.name} <br />
              {shippingInfo.address1}
              {shippingInfo.address2 && <>, {shippingInfo.address2}</>}
              <br />
              {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
            </p>
          </div>
        )}

        <div className="text-gray-200 font-semibold mb-8 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="text-cyan-300">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (8%)</span>
            <span className="text-cyan-300">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base border-t border-white/10 pt-2">
            <span>Total</span>
            <span className="text-blue-300">${totalCost.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleReturnHome}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl text-sm font-medium shadow-lg hover:shadow-cyan-500/30 transition-all"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default function ViewConfirmation() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <ViewConfirmationContent />
    </Suspense>
  );
}
