import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, pendingOrders, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
  ]);

  const totalRevenue = revenue._sum.totalAmount ?? 0;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Admin overview</h1>
        <p className="text-sm text-slate-600">Quick stats across your store.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Products</p>
          <p className="text-2xl font-bold text-slate-900">{productCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Orders</p>
          <p className="text-2xl font-bold text-slate-900">{orderCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Pending</p>
          <p className="text-2xl font-bold text-slate-900">{pendingOrders}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Revenue (all time)</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>
    </div>
  );
}
