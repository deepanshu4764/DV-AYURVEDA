import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type ShopPageProps = {
  searchParams?: {
    q?: string;
    category?: string;
    sort?: string;
  };
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const q = searchParams?.q?.toString() ?? "";
  const category = searchParams?.category?.toString() ?? "";
  const sort = searchParams?.sort?.toString() ?? "";

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { category: { contains: q } },
    ];
  }

  if (category) {
    where.category = category;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
    }),
    prisma.product.findMany({
      where: { isActive: true, category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categoryList = categories
    .map((c) => c.category)
    .filter((c): c is string => Boolean(c));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Shop</h1>
        <p className="text-sm text-slate-600">Search, filter, and shop Ayurvedic essentials.</p>
      </div>

      <SearchBar
        defaultQuery={q}
        categories={categoryList}
        selectedCategory={category}
        sort={sort}
      />

      {products.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
          No products found. Try adjusting your filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
