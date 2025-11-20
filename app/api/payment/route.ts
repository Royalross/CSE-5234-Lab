export async function POST(req: Request) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/payment`;

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await req.text(),
  });

  return new Response(await r.text(), { status: r.status });
}
