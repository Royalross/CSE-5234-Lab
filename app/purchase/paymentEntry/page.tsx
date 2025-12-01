"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

type PaymentForm = {
  name: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export default function PaymentEntry() {
  const router = useRouter();
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [form, setForm] = useState<PaymentForm>({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("paymentInfo");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSaveAndReturn = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("paymentInfo", JSON.stringify(form));
    router.push("/purchase/viewOrder");
  };

  const handleCancel = () => router.push("/purchase/viewOrder");

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]
      bg-gradient-to-br from-[#0a0f24] via-[#11172e] to-[#1a2240]">
      
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl 
        p-8 w-full max-w-md border border-white/20 scale-[0.98] text-white">
        
        <h1 className="text-3xl font-bold text-center mb-6 
          bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Payment Information
        </h1>

        <form onSubmit={handleSaveAndReturn} className="space-y-5">
          {/* Cardholder Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-1">
              Cardholder Name
            </label>
            <input
              name="name"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={handleChange}
              className="p-2 bg-white/10 border border-white/20 rounded-lg 
                text-sm text-white placeholder-gray-400 outline-none 
                focus:ring-2 focus:ring-cyan-400 transition"
            />
          </div>

          {/* Card Number */}
          <div className="flex flex-col relative">
            <label className="text-sm font-medium text-gray-300 mb-1">
              Card Number
            </label>
            <input
              type={showCardNumber ? "text" : "password"}
              name="cardNumber"
              placeholder="xxxx xxxx xxxx xxxx"
              value={form.cardNumber}
              onChange={handleChange}
              className="p-2 bg-white/10 border border-white/20 rounded-lg 
                text-sm text-white pr-10 placeholder-gray-400 outline-none 
                focus:ring-2 focus:ring-cyan-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowCardNumber(!showCardNumber)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white transition">
              {showCardNumber ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Expiry */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-1">
              Expiration Date
            </label>
            <input
              name="expiry"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={handleChange}
              className="p-2 bg-white/10 border border-white/20 rounded-lg 
                text-sm text-white placeholder-gray-400 outline-none 
                focus:ring-2 focus:ring-cyan-400 transition"
            />
          </div>

          {/* CVV */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-1">
              CVV
            </label>
            <input
              type="password"
              name="cvv"
              placeholder="***"
              value={form.cvv}
              onChange={handleChange}
              className="p-2 bg-white/10 border border-white/20 rounded-lg 
                text-sm text-white placeholder-gray-400 outline-none 
                focus:ring-2 focus:ring-cyan-400 transition"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-300 text-sm hover:text-white transition">
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 
                hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg 
                text-sm font-medium shadow-lg hover:shadow-cyan-500/30 transition-all">
              Save &amp; Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
