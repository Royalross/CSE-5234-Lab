"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function PaymentEntry() {
  const router = useRouter();
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    localStorage.removeItem("paymentInfo");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    localStorage.setItem("paymentInfo", JSON.stringify(form));
    router.push("/purchase/shippingEntry");
  };

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md border border-blue-100 scale-95">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Payment Information
        </h1>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1">Cardholder Name</label>
            <input
              name="name"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              className="p-2 border border-blue-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
            />
          </div>
          <div className="flex flex-col relative">
            <label className="text-gray-700 text-sm font-medium mb-1">Card Number</label>
            <input
              type={showCardNumber ? "text" : "password"}
              name="cardNumber"
              placeholder="xxxx xxxx xxxx xxxx"
              value={form.cardNumber}
              onChange={handleChange}
              autoComplete="off"
              className="p-2 border border-blue-200 focus:border-blue-500 rounded-lg text-sm pr-10 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCardNumber(!showCardNumber)}
              className="absolute right-3 top-9 text-gray-500 hover:text-blue-600"
            >
              {showCardNumber ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1">Expiration Date</label>
            <input
              name="expiry"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={handleChange}
              autoComplete="off"
              className="p-2 border border-blue-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1">CVV</label>
            <input
              type="password"
              name="cvv"
              placeholder="***"
              value={form.cvv}
              onChange={handleChange}
              autoComplete="off"
              className="p-2 border border-blue-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
            />
          </div>
        </div>
        <button
          onClick={handleNext}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg text-sm font-medium shadow-md transition-all"
        >
          Next
        </button>
      </div>
    </main>
  );
}
