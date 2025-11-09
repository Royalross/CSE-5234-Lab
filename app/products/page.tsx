// app/products/page.tsx
import Link from "next/link";
import { pool } from "@/lib/db";

type Item = {
  id: number;
  itemNumber: number;
  name: string;
  description: string;
  availableQuantity: number;
  unitPrice: number;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage() {
  const { rows } = await pool.query<Item>(`
    SELECT id,
           item_number AS "itemNumber",
           name,
           description,
           available_quantity AS "availableQuantity",
           unit_price AS "unitPrice"
    FROM item
    ORDER BY id ASC;
  `);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Products (from RDS)</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {rows.map((it) => (
          <article
            key={it.id}
            className="rounded-2xl border p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="aspect-[16/9] w-full rounded-xl bg-gray-100 mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>

            <h2 className="text-lg font-semibold">{it.name}</h2>
            <p className="text-sm text-gray-500 line-clamp-2">
              {it.description}
            </p>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-xl font-bold">
                ${it.unitPrice.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">
                Qty: {it.availableQuantity}
              </span>
            </div>

            <Link
              href={`/purchase?item=${it.itemNumber}`}
              className="mt-4 block w-full text-center rounded-xl bg-purple-600 text-white py-2 hover:bg-purple-700 transition"
            >
              View / Add
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
