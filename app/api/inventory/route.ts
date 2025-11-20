export async function GET() {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/inventory-management/inventory/items`;
  const r = await fetch(url);

  return new Response(await r.text(), { status: r.status });
}
