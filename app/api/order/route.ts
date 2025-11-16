import { createOrder, OrderError } from "@/lib/orderService";
import type { OrderPayload } from "@/lib/orderTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: OrderPayload;

  try {
    body = (await req.json()) as OrderPayload;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const result = await createOrder(body);
    return Response.json(result, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: any) {
    if (err instanceof OrderError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error("[POST /api/order] unexpected", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
