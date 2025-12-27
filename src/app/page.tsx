import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="space-y-10">
      <section className="grid gap-6 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 via-white to-emerald-50 border border-slate-200 px-6 py-10 md:grid-cols-2 md:items-center md:px-10">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Ayurveda, simplified
          </p>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            Clean, natural care rooted in tradition.
          </h1>
          <p className="text-base text-slate-700">
            Discover thoughtfully curated Ayurveda essentials. Simple ingredients, transparent
            sourcing, and everyday wellness you can trust.
          </p>
          <div className="flex gap-3">
            <Link
              href="/shop"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Shop now
            </Link>
            <Link
              href="/account/orders"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              My orders
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <div className="grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                  <p className="font-semibold text-slate-900 line-clamp-2">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.category ?? "Wellness"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">New arrivals</h2>
          <Link href="/shop" className="text-sm font-semibold text-slate-700 hover:underline">
            View all
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
            No products yet. Login as admin to add products.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
