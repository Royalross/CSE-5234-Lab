"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import axios from "axios"; // Lab 6

interface Item {
  id: number;
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

export default function ViewConfirmation() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [confirmationNumber, setConfirmationNumber] = useState<string>("");

  // ---------------- save order to DB for lab6 ----------------
  async function saveOrderToDB() {
    try {
      // const payload = {
      //   cartItems,
      //   paymentInfo,
      //   shippingInfo,
      //   subtotal,
      //   tax,
      //   totalCost,
      //   confirmationNumber,
      // };
      // const res = await axios.post("/api/orders/confirm", payload);
      // console.log("Order saved:", res.data);
      console.log("saveOrderToDB called:", {
        cartItems,
        paymentInfo,
        shippingInfo,
        subtotal,
        tax,
        totalCost,
        confirmationNumber,
      });
    } catch (err) {
      console.error("Error saving confirmation:", err);
    }
  }

  // ---------------- get order info ----------------
  useEffect(() => {
    const orderSummary = localStorage.getItem("orderSummary");
    if (orderSummary) {
      const data = JSON.parse(orderSummary);
      setCartItems(data.cartItems || []);
      setPaymentInfo(data.paymentInfo || null);
      setShippingInfo(data.shippingInfo || null);
      setSubtotal(data.subtotal || 0);
      setTax(data.tax || 0);
      setTotalCost(data.totalCost || 0);
    }

    // hardcode a random num in this lab, will be generated from BE in lab 6
    const randomCode = "ORD-" + Math.floor(Math.random() * 900000 + 100000);
    setConfirmationNumber(randomCode);

    // save to DB, will add a url in lab 6
    saveOrderToDB();
  }, []);

  // ---------------- buttons ----------------
  const handleReturnHome = () => {
    localStorage.removeItem("cartItems");
    localStorage.removeItem("orderSummary");
    router.push("/purchase");
  };

  // ---------------- pages ----------------
  return (
    <main className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md border border-green-100 scale-95">
        <h1 className="text-2xl font-bold text-center mb-4 text-green-700">
          🎉 Order Confirmed!
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* confirmation num */}
        <div className="text-center mb-6">
          <span className="font-semibold text-gray-800">
            Confirmation Number:
          </span>
          <div className="text-xl font-mono text-blue-700 mt-1">
            {confirmationNumber}
          </div>
        </div>

        {/* items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Order Summary
          </h2>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm text-gray-700 border-b py-1"
            >
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* pmt and shipping */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Payment Info</h2>
          {paymentInfo && (
            <p className="text-sm text-gray-700 mt-1">
              Card Holder: {paymentInfo.cardHolder} <br />
              Card Number: **** **** **** {paymentInfo.cardNumber.slice(
                -4
              )}{" "}
              <br />
              Expiry: {paymentInfo.expiry}
            </p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Shipping Info</h2>
          {shippingInfo && (
            <p className="text-sm text-gray-700 mt-1">
              {shippingInfo.name} <br />
              {shippingInfo.address1}
              {shippingInfo.address2 && <>, {shippingInfo.address2}</>}
              <br />
              {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
            </p>
          )}
        </div>

        {/* subTotal */}
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

        {/* button at the bottom of the page */}
        {/* WILL RETUEN TO http://localhost:3000/purchase */}
        <button
          onClick={handleReturnHome}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-2 rounded-lg text-sm font-medium shadow-md transition-all"
        >
          Return to Home
        </button>
      </div>
    </main>
  );
}
