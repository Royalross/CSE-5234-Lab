"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

// Form data type
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

  // Load saved shipping info from localStorage (same idea as paymentInfo)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("shippingInfo");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse error
    }
  }, []);

  // Handle text field changes
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // Save & Return → only save to localStorage, then go back to viewOrder
  function handleSaveAndReturn(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("shippingInfo", JSON.stringify(form));
    router.push("/purchase/viewOrder");
  }

  // Cancel → just go back without saving
  function handleCancel() {
    router.push("/purchase/viewOrder");
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-2xl bg-slate-900/70 p-8 shadow-2xl shadow-sky-900/40 border border-slate-700/60">
          <h1 className="mb-6 text-center text-3xl font-bold text-sky-400">
            Shipping Information
          </h1>

          <form className="space-y-4" onSubmit={handleSaveAndReturn}>
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-200">
                Name
              </label>
              <input
                name="name"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500"
              />
            </div>

            {/* Address Line 1 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-200">
                Address Line 1
              </label>
              <input
                name="address1"
                placeholder="Street address, P.O. box"
                value={form.address1}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500"
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-200">
                Address Line 2
              </label>
              <input
                name="address2"
                placeholder="Apartment, suite, unit, etc. (optional)"
                value={form.address2}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500"
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-200">
                  City
                </label>
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-200">
                  State
                </label>
                <input
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Zip Code */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-200">
                Zip Code
              </label>
              <input
                name="zip"
                placeholder="Zip Code"
                value={form.zip}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-between gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition-colors"
              >
                Save &amp; Return
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
