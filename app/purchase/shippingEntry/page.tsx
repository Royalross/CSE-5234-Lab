"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

type ShippingForm = {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
};

export default function ShippingEntry() {
  const router = useRouter();
  const [form, setForm] = useState<ShippingForm>({
    name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shippingInfo");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ShippingForm>;
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveAndReturn = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("shippingInfo", JSON.stringify(form));
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
          Shipping Information
        </h1>

        <form onSubmit={handleSaveAndReturn} className="space-y-5">
          {[
            { label: "Full Name", name: "name" },
            { label: "Address Line 1", name: "address1" },
            { label: "Address Line 2", name: "address2" },
            { label: "City", name: "city" },
            { label: "State", name: "state" },
            { label: "ZIP Code", name: "zip" },
          ].map((f) => (
            <div key={f.name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-1">
                {f.label}
              </label>
              <input
                name={f.name}
                value={(form as any)[f.name]}
                onChange={handleChange}
                className="p-2 bg-white/10 border border-white/20 rounded-lg 
                  text-sm text-white placeholder-gray-400 outline-none 
                  focus:ring-2 focus:ring-cyan-400 transition"
                placeholder={f.label}
              />
            </div>
          ))}

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
