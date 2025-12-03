import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const baseUrl = process.env.SHIPPING_SERVICE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "SHIPPING_SERVICE_URL not configured" },
        { status: 500 },
      );
    }

    const res = await fetch(`${baseUrl}/shipping`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Shipping service error:", data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Server side error calling shipping service:", err);
    return NextResponse.json(
      { error: "Server error while calling shipping service" },
      { status: 500 },
    );
  }
}
