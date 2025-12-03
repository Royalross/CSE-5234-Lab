"use client";

import { useState, type ChangeEvent } from "react";
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

  // Handle input changes
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Submit form → call AWS API Gateway → Lambda → RDS
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    //  API Gateway base URL
    const baseUrl = process.env.NEXT_PUBLIC_SHIPPING_SERVICE_URL;

    if (!baseUrl) {
      alert("Shipping service URL not configured!");
      return;
    }

    const payload = {
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      country: "US",
      postal_code: form.zip,
      email: `${form.name || "user"}@example.com`, // If no email on the frontend, just generate one
    };

    try {
      const res = await fetch(`${baseUrl}/shipping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Error:", data);
        alert("Failed to submit shipping info");
        return;
      }

      console.log("SUCCESS:", data);
      alert("Shipping info submitted successfully!");

      // jump to confirmation page
      router.push("/purchase/viewConfirmation");
    } catch (err) {
      console.error("Shipping error:", err);
      alert("Network error");
    }
  }

  return (
    <div>
      <h1>Shipping Information</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="address1"
          placeholder="Address Line 1"
          value={form.address1}
          onChange={handleChange}
        />
        <input
          name="address2"
          placeholder="Address Line 2"
          value={form.address2}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
        />
        <input
          name="zip"
          placeholder="Zip Code"
          value={form.zip}
          onChange={handleChange}
        />

        <button type="submit">Submit Shipping Info</button>
      </form>
    </div>
  );
}
