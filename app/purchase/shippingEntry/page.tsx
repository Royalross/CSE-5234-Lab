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

  // load existing shippingInfo (if any)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("shippingInfo");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ShippingForm>;
        setForm((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch (e) {
      console.warn("Failed to load shippingInfo from storage", e);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAndReturn = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("shippingInfo", JSON.stringify(form));
    router.push("/purchase/viewOrder");
  };

  const handleCancel = () => {
    router.push("/purchase/viewOrder");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md border border-blue-100 scale-95">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Shipping Information
        </h1>

        <form onSubmit={handleSaveAndReturn} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              name="name"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              className="p-2 border border-blue-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1">
              Address Line 1
            </label>
            <input
              name="address1"
              placeholder="Street address, P.O. box"
              value={form.address1}
              onChange={handleChange}
              autoComplete="off"
              className="p-2 border border-blue-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1">
              Address Line 2
            </label>
            <input
              name="address2"
              placeholder="Apartment, suite, unit (optional)"
              value={form.address2}
              onChange={handleChange}
              autoComplete="off"
              className="p-2 border border-blue-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1">
              City
            </label>
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              autoComplete="off"
              className="p-2 border border-blue-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1">
              State
            </label>
            <input
              name="state"
              placeholder="State or Province"
              value={form.state}
              onChange={handleChange}
              autoComplete="off"
              className="p-2 border border-blue-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-1">
              ZIP Code
            </label>
            <input
              name="zip"
              placeholder="ZIP or Postal Code"
              value={form.zip}
              onChange={handleChange}
              autoComplete="off"
              className="p-2 border border-blue-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-500 text-sm underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
            >
              Save &amp; Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
