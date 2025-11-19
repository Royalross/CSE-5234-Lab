// app/api/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createOrder, OrderError } from "@/lib/orderService";
import type { OrderPayload } from "@/lib/orderTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderPayload;

    // at least one item
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order must contain at least one item." },
        { status: 400 },
      );
    }

    // Delegate all logic to createOrder (write to RDS, deduct inventory, save payment/shipping)
    const result = await createOrder(body);

    return NextResponse.json(
      {
        success: true,
        orderId: result.orderId,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("[POST /api/order] error:", err);

    if (err instanceof OrderError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to place order (server error)." },
      { status: 500 },
    );
  }
}
