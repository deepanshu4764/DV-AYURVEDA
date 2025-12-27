import { DeleteProductButton } from "@/components/delete-product-button";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-600">Create, edit, or remove products.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          New product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
          No products yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{product.name}</div>
                    <div className="text-xs text-slate-500">Slug: {product.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{product.category}</td>
                  <td className="px-4 py-3 text-slate-700">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 text-slate-700">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        product.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {product.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
